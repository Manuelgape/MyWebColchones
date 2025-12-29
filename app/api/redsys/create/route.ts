import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPaymentRequest, type RedsysConfig } from "@/lib/redsys-utils";
import { isAllowedPostalCode } from "@/lib/postal-codes";

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
  try {
    // Parse request body
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Validate postal code
    if (!isAllowedPostalCode(validated.customer.postal_code)) {
      return NextResponse.json(
        { error: "Postal code not in delivery area" },
        { status: 400 }
      );
    }

    // Calculate total amount in cents
    const totalCents = Math.round(
      validated.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * 100
    );

    if (totalCents <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Create order in database
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

    // Get Redsys config from env
    const redsysConfig: RedsysConfig = {
      merchantCode: process.env.REDSYS_MERCHANT_CODE || "",
      terminal: process.env.REDSYS_TERMINAL || "1",
      secretKey: process.env.REDSYS_SECRET_KEY || "",
      currency: process.env.REDSYS_CURRENCY || "978",
      transactionType: process.env.REDSYS_TRANSACTION_TYPE || "0",
      merchantName: process.env.REDSYS_MERCHANT_NAME || "Tu Mejor Sueño",
      environment: (process.env.REDSYS_ENVIRONMENT as "testing" | "production") || "testing",
    };

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

    // Create Redsys payment request
    const paymentForm = createPaymentRequest(
      redsysConfig,
      order.id,
      totalCents / 100,
      validated.customer.email,
      `${appBaseUrl}/api/redsys/notify`,
      `${appBaseUrl}/checkout/ok?orderId=${order.id}`,
      `${appBaseUrl}/checkout/ko?orderId=${order.id}`
    );

    // Log the request
    await prisma.auditLog.create({
      data: {
        event: "order_created",
        orderId: order.id,
        payload: JSON.stringify({ orderId: order.id, amountCents: totalCents }),
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        ...paymentForm,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
