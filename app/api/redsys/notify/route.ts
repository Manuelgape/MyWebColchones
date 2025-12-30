import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRedsysSignature,
  decodeMerchantParameters,
  isPaymentSuccessful,
} from "@/lib/redsys-utils";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/redsys/notify
 * 
 * Redsys notification endpoint (server-to-server)
 * - Receives x-www-form-urlencoded POST
 * - Validates signature
 * - Handles idempotency (Redsys may retry)
 * - Updates order status
 * - Returns 200 quickly
 * 
 * IMPORTANT: We must NOT parse the body via middleware.
 * We read raw body to preserve signature validation.
 */

export async function POST(request: NextRequest) {
  let rawBody = "";
  let orderId: string | null = null;

  try {
    // Read raw body (do NOT parse automatically)
    const bodyText = await request.text();
    rawBody = bodyText;

    // Parse form-urlencoded
    const params = new URLSearchParams(bodyText);
    const dsSignatureVersion = params.get("Ds_SignatureVersion") || "";
    const dsMerchantParameters = params.get("Ds_MerchantParameters") || "";
    const dsSignature = params.get("Ds_Signature") || "";

    if (!dsSignatureVersion || !dsMerchantParameters || !dsSignature) {
      console.warn("Missing Redsys signature fields");
      return NextResponse.json(
        { error: "Missing signature fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const secretKey = process.env.REDSYS_SECRET_KEY || "";
    const isValidSignature = verifyRedsysSignature(
      dsMerchantParameters,
      dsSignature,
      secretKey
    );

    if (!isValidSignature) {
      console.error("Redsys signature verification failed");
      await prisma.auditLog.create({
        data: {
          event: "redsys_notify_signature_failed",
          payload: JSON.stringify({ dsMerchantParameters, dsSignature }),
        },
      });
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 403 }
      );
    }

    // Decode merchant parameters
    const decodedParams = decodeMerchantParameters(dsMerchantParameters);
    orderId = decodedParams.Ds_Order || null;
    const responseCode = decodedParams.Ds_Response || "";
    const authCode = decodedParams.Ds_AuthorizationCode || "";

    if (!orderId) {
      console.warn("Missing Ds_Order in merchant parameters");
      await prisma.auditLog.create({
        data: {
          event: "redsys_notify_missing_order",
          payload: JSON.stringify(decodedParams),
        },
      });
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.warn(`Order not found: ${orderId}`);
      await prisma.auditLog.create({
        data: {
          event: "redsys_notify_order_not_found",
          orderId,
          payload: JSON.stringify(decodedParams),
        },
      });
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Idempotency: check if payment already recorded
    const existingPayment = await prisma.payment.findUnique({
      where: {
        orderId_provider: {
          orderId: orderId,
          provider: "redsys",
        },
      },
    });

    if (existingPayment) {
      // Already processed; log and return 200
      console.info(`Payment already recorded for order ${orderId}`);
      await prisma.auditLog.create({
        data: {
          event: "redsys_notify_duplicate",
          orderId,
          payload: JSON.stringify(decodedParams),
        },
      });
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Determine payment status
    const isSuccess = isPaymentSuccessful(responseCode);
    const newOrderStatus = isSuccess ? "PAID" : "FAILED";

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: orderId,
        provider: "redsys",
        responseCode: responseCode,
        authCode: authCode,
        orderId3DS: decodedParams.Ds_Order,
        rawNotification: JSON.stringify(decodedParams),
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newOrderStatus },
    });

    // Log the notification
    await prisma.auditLog.create({
      data: {
        event: `redsys_notify_${newOrderStatus.toLowerCase()}`,
        orderId: orderId,
        payload: JSON.stringify({
          responseCode,
          authCode,
          decodedParams,
        }),
      },
    });

    console.info(
      `Redsys notification processed: Order ${orderId} -> ${newOrderStatus}`
    );

    // Return 200 quickly (other actions like email can be async)
    // TODO: Trigger email notification, webhook, etc. in background
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error processing Redsys notification:", error);

    await prisma.auditLog.create({
      data: {
        event: "redsys_notify_error",
        orderId: orderId,
        payload: JSON.stringify({ rawBody }),
        error: error instanceof Error ? error.message : String(error),
      },
    });

    // Return 200 even on error to prevent Redsys from retrying
    // The error is logged for manual review
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
