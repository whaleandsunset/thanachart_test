import { Product, CheckoutResult } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5110";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function checkout(
  items: { productId: number; quantity: number }[]
): Promise<CheckoutResult> {
  const res = await fetch(`${API_URL}/api/cart/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Checkout failed");
  }
  return res.json();
}
