import type { Product } from "./types";

export interface SavedItem {
  id: string;
  userId: string;
  productId: string;
  savedAt: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
}

export async function fetchSavedItems(userId: string): Promise<SavedItem[]> {
  const response = await fetch("/api/saved-items", {
    headers: {
      "X-User-Id": userId,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch saved items: ${response.status}`);
  }
  return response.json();
}

export async function saveProduct(userId: string, productId: string): Promise<Response> {
  const response = await fetch(`/api/products/${productId}/save`, {
    method: "POST",
    headers: {
      "X-User-Id": userId,
    },
  });
  if (!response.ok && response.status !== 200 && response.status !== 201 && response.status !== 409) {
    throw new Error(`Failed to save product: ${response.status}`);
  }
  return response;
}

export async function unsaveProduct(userId: string, productId: string): Promise<Response> {
  const response = await fetch(`/api/products/${productId}/save`, {
    method: "DELETE",
    headers: {
      "X-User-Id": userId,
    },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to unsave product: ${response.status}`);
  }
  return response;
}
