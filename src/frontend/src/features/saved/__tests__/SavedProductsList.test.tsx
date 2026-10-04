import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SavedProductsList } from "../SavedProductsList";

const sampleProduct = {
  id: "prod-001",
  name: "Trail Running Shoes",
  category: "Footwear",
  price: 129.99,
  description: "Lightweight shoes built for uneven terrain.",
};

const sampleSavedItem = {
  id: "saved-001",
  userId: "user-123",
  productId: "prod-001",
  savedAt: "2024-01-01T00:00:00Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SavedProductsList", () => {
  it("shows empty state when no saved items", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url: string) => {
      if (url === "/api/saved-items") {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        } as Response);
      }
      if (url === "/api/products") {
        return Promise.resolve({
          ok: true,
          json: async () => [sampleProduct],
        } as Response);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(<SavedProductsList userId="user-123" />);

    await waitFor(() => {
      expect(screen.getByText(/no products saved yet/i)).toBeInTheDocument();
    });
  });

  it("renders saved products", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url: string) => {
      if (url === "/api/saved-items") {
        return Promise.resolve({
          ok: true,
          json: async () => [sampleSavedItem],
        } as Response);
      }
      if (url === "/api/products") {
        return Promise.resolve({
          ok: true,
          json: async () => [sampleProduct],
        } as Response);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(<SavedProductsList userId="user-123" />);

    await waitFor(() => {
      expect(screen.getByText("Trail Running Shoes")).toBeInTheDocument();
    });
    expect(screen.getAllByTestId("saved-product-card")).toHaveLength(1);
  });
});
