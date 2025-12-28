const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type WebOrderItem = {
  product_slug: string;
  variant_id: string;
  variant_name: string;
  size: string;
  quantity: number;
  unit_price: number;
};

export type WebOrderCustomer = {
  full_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
};

export type WebOrderCreate = {
  customer: WebOrderCustomer;
  items: WebOrderItem[];
  notes?: string;
};

export type WebOrderResponse = {
  success: boolean;
  order_code: string;
  order_id: number;
  message: string;
};

export async function createOrder(
  order: WebOrderCreate
): Promise<WebOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/public/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "Error al crear el pedido",
    }));
    throw new Error(error.detail || "Error al crear el pedido");
  }

  return response.json();
}
