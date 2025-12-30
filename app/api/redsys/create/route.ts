import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPaymentRequest, type RedsysConfig } from "@/lib/redsys-utils";
import { isAllowedPostalCode } from "@/lib/postal-codes";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Importación dinámica de Prisma para evitar problemas con Turbopack
async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    postal_code: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    province: z.string().min(1),
  }),
  items: z.array(
    z.object({
      product_slug: z.string(),
      product_name: z.string(),
      variant_id: z.string(),
      variant_name: z.string(),
      size: z.string(),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
    })
  ),
  notes: z.string().optional(),
});

type CreateOrderRequest = z.infer<typeof createOrderSchema>;

export async function POST(request: NextRequest) {
  console.log("🔵 [API] POST /api/redsys/create - START");
  
  try {
    // Parse request body
    console.log("📥 [API] Parsing request body...");
    const body = await request.json();
    console.log("📥 [API] Body received:", JSON.stringify(body, null, 2));
    
    console.log("✅ [API] Validating schema...");
    const validated = createOrderSchema.parse(body);
    console.log("✅ [API] Schema validation passed");

    // Validate postal code
    console.log("📮 [API] Validating postal code:", validated.customer.postal_code);
    if (!isAllowedPostalCode(validated.customer.postal_code)) {
      console.log("❌ [API] Postal code not allowed");
      return NextResponse.json(
        { error: "Postal code not in delivery area" },
        { status: 400 }
      );
    }
    console.log("✅ [API] Postal code validated");

    // Calculate total amount in cents
    const totalCents = Math.round(
      validated.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * 100
    );
    console.log("💰 [API] Total amount calculated:", totalCents, "cents (", totalCents/100, "EUR)");

    if (totalCents <= 0) {
      console.log("❌ [API] Invalid order amount:", totalCents);
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Get Prisma client
    console.log("🔌 [API] Getting Prisma client...");
    const prisma = await getPrisma();
    console.log("✅ [API] Prisma client obtained");

    // Create order in database
    console.log("💾 [API] Creating order in database...");
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        amountCents: totalCents,
        currency: "EUR",
        customerName: validated.customer.name,
        customerEmail: validated.customer.email,
        customerPhone: validated.customer.phone,
        customerAddress: validated.customer.address,
        customerCity: validated.customer.city,
        customerProvince: validated.customer.province,
        postalCode: validated.customer.postal_code,
        notes: validated.notes,
        items: {
          create: validated.items.map((item) => ({
            productSlug: item.product_slug,
            productName: item.product_name,
            variantId: item.variant_id,
            variantName: item.variant_name,
            size: item.size,
            quantity: item.quantity,
            unitPriceCents: Math.round(item.unit_price * 100),
          })),
        },
      },
      include: { items: true },
    });
    console.log("✅ [API] Order created with ID:", order.id);

    // Get Redsys config from env
    console.log("🔧 [API] Loading Redsys configuration from env...");
    const redsysConfig: RedsysConfig = {
      merchantCode: process.env.REDSYS_MERCHANT_CODE || "",
      terminal: process.env.REDSYS_TERMINAL || "1",
      secretKey: process.env.REDSYS_SECRET_KEY || "",
      currency: process.env.REDSYS_CURRENCY || "978",
      transactionType: process.env.REDSYS_TRANSACTION_TYPE || "0",
      merchantName: process.env.REDSYS_MERCHANT_NAME || "Tu Mejor Sueño",
      environment: (process.env.REDSYS_ENVIRONMENT as "testing" | "production") || "testing",
    };
    console.log("🔧 [API] Redsys config:", {
      merchantCode: redsysConfig.merchantCode,
      terminal: redsysConfig.terminal,
      currency: redsysConfig.currency,
      transactionType: redsysConfig.transactionType,
      merchantName: redsysConfig.merchantName,
      environment: redsysConfig.environment,
      secretKeyLength: redsysConfig.secretKey.length
    });

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    console.log("🌐 [API] App base URL:", appBaseUrl);

    // Create Redsys payment request
    console.log("💳 [API] Creating Redsys payment request...");
    const paymentForm = createPaymentRequest(
      redsysConfig,
      order.id,
      totalCents / 100,
      validated.customer.email,
      `${appBaseUrl}/api/redsys/notify`,
      `${appBaseUrl}/checkout/ok?orderId=${order.id}`,
      `${appBaseUrl}/checkout/ko?orderId=${order.id}`
    );
    console.log("✅ [API] Payment form created:", paymentForm);

    // Log the request
    console.log("📝 [API] Creating audit log...");
    await prisma.auditLog.create({
      data: {
        event: "order_created",
        orderId: order.id,
        payload: JSON.stringify({ orderId: order.id, amountCents: totalCents }),
      },
    });
    console.log("✅ [API] Audit log created");

    console.log("🟢 [API] POST /api/redsys/create - SUCCESS");
    return NextResponse.json(
      {
        orderId: order.id,
        ...paymentForm,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ [API] Validation error:", JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    console.error("❌ [API] Unexpected error:", error);
    console.error("❌ [API] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("❌ [API] Error name:", error instanceof Error ? error.name : "Unknown");
    console.error("❌ [API] Error message:", error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        error: "Failed to create order",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
