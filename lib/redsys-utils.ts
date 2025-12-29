import crypto from "crypto";
import base64url from "base64-url";

/**
 * Redsys utility functions for payment processing
 * Ported from redsys_service.py to TypeScript
 */

export interface RedsysConfig {
  merchantCode: string;
  terminal: string;
  secretKey: string; // base64 encoded
  currency: string;
  transactionType: string;
  merchantName: string;
  environment: "testing" | "production";
}

export interface MerchantParameters {
  DS_MERCHANT_AMOUNT: string;
  DS_MERCHANT_ORDER: string;
  DS_MERCHANT_MERCHANTCODE: string;
  DS_MERCHANT_CURRENCY: string;
  DS_MERCHANT_TRANSACTIONTYPE: string;
  DS_MERCHANT_TERMINAL: string;
  DS_MERCHANT_MERCHANTURL: string;
  DS_MERCHANT_URLOK: string;
  DS_MERCHANT_URLKO: string;
  DS_MERCHANT_CONSUMERLANGUAGE: string;
  DS_MERCHANT_MERCHANTNAME: string;
  DS_MERCHANT_EMV3DS?: string;
}

export interface PaymentRequest {
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
  action_url: string;
}

export function getRedsysUrl(environment: "testing" | "production"): string {
  if (environment === "production") {
    return "https://sis.redsys.es/sis/realizarPago";
  }
  return "https://sis-t.redsys.es:25443/sis/realizarPago";
}

export function createMerchantSignature(
  orderId: string,
  merchantParameters: string,
  secretKey: string
): string {
  try {
    // Decode secret key from base64
    const key = Buffer.from(secretKey, "base64");

    // Create HMAC SHA256 with order ID
    const cipher = crypto.createHmac("sha256", key);
    cipher.update(orderId);
    const encryptedOrder = cipher.digest();

    // Create final signature
    const signature = crypto.createHmac("sha256", encryptedOrder);
    signature.update(merchantParameters);

    // Return base64 encoded signature
    return signature.digest("base64");
  } catch (error) {
    console.error("Error creating merchant signature:", error);
    throw error;
  }
}

export function createPaymentRequest(
  config: RedsysConfig,
  orderId: string,
  amountEur: number,
  customerEmail: string,
  merchantUrl: string,
  okUrl: string,
  koUrl: string
): PaymentRequest {
  // Amount in cents (Redsys requires integer)
  const amountCents = Math.round(amountEur * 100);

  // Ensure order ID is max 12 characters
  const paddedOrderId = orderId.slice(-12).padStart(12, "0");

  // Create merchant parameters
  const params: MerchantParameters = {
    DS_MERCHANT_AMOUNT: amountCents.toString(),
    DS_MERCHANT_ORDER: paddedOrderId,
    DS_MERCHANT_MERCHANTCODE: config.merchantCode,
    DS_MERCHANT_CURRENCY: config.currency,
    DS_MERCHANT_TRANSACTIONTYPE: config.transactionType,
    DS_MERCHANT_TERMINAL: config.terminal,
    DS_MERCHANT_MERCHANTURL: merchantUrl,
    DS_MERCHANT_URLOK: okUrl,
    DS_MERCHANT_URLKO: koUrl,
    DS_MERCHANT_CONSUMERLANGUAGE: "001", // Spanish
    DS_MERCHANT_MERCHANTNAME: config.merchantName,
  };

  if (customerEmail) {
    params.DS_MERCHANT_EMV3DS = JSON.stringify({
      email: customerEmail,
    });
  }

  // Encode parameters to base64
  const paramsJson = JSON.stringify(params);
  const paramsB64 = Buffer.from(paramsJson).toString("base64");

  // Create signature
  const signature = createMerchantSignature(
    paddedOrderId,
    paramsB64,
    config.secretKey
  );

  return {
    Ds_SignatureVersion: "HMAC_SHA256_V1",
    Ds_MerchantParameters: paramsB64,
    Ds_Signature: signature,
    action_url: getRedsysUrl(config.environment),
  };
}

export function verifyRedsysSignature(
  merchantParameters: string,
  signature: string,
  secretKey: string
): boolean {
  try {
    // Decode merchant parameters
    const paramsJson = Buffer.from(merchantParameters, "base64").toString();
    const params = JSON.parse(paramsJson);
    const orderId = params.Ds_Order;

    // Calculate expected signature
    const expectedSignature = createMerchantSignature(
      orderId,
      merchantParameters,
      secretKey
    );

    return signature === expectedSignature;
  } catch (error) {
    console.error("Error verifying Redsys signature:", error);
    return false;
  }
}

export function decodeMerchantParameters(
  merchantParameters: string
): Record<string, any> {
  try {
    const paramsJson = Buffer.from(merchantParameters, "base64").toString();
    return JSON.parse(paramsJson);
  } catch (error) {
    console.error("Error decoding merchant parameters:", error);
    return {};
  }
}

export function isPaymentSuccessful(responseCode: string): boolean {
  try {
    const code = parseInt(responseCode, 10);
    return code >= 0 && code <= 99;
  } catch {
    return false;
  }
}
