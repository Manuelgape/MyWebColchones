const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CreateOrderRequest = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    province: string;
  };
  items: {
    product_slug: string;
    product_name: string;
    variant_id: string;
    variant_name: string;
    size: string;
    quantity: number;
    unit_price: number;
  }[];
  notes?: string;
};

export type CreateOrderResponse = {
  order_id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  payment_form: {
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
    action_url: string;
  };
};

export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_URL}/api/v1/public/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error al crear el pedido");
  }

  return response.json();
}
