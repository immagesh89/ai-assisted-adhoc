import { useEffect, useState } from "react";
import { fetchProducts, fetchSavedItems } from "./api";
import { ProductCard } from "./ProductCard";
import { SaveButton } from "../saved/SaveButton";
import type { Product } from "./types";
import type { SavedItem } from "./api";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [capMessage, setCapMessage] = useState("");

  const userId = "user-123"; // stubbed auth

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchProducts(), fetchSavedItems(userId)])
      .then(([productsData, savedData]) => {
        if (!cancelled) {
          setProducts(productsData);
          setSavedItems(savedData);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isSaved = (productId: string) => savedItems.some((s) => s.productId === productId);

  const handleCapHit = () => {
    setCapMessage("Cannot save more than 20 items.");
    setTimeout(() => setCapMessage(""), 3000);
  };

  if (status === "loading") {
    return <p className="status-message">Loading products.</p>;
  }

  if (status === "error") {
    return (
      <p className="status-message">
        Couldn't load products. Is the API running on localhost:5080?
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="status-message">No products found.</p>;
  }

  return (
    <div>
      {capMessage && <p className="status-message" role="alert">{capMessage}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} data-testid="product-item">
            <ProductCard product={product} />
            <SaveButton
              userId={userId}
              productId={product.id}
              isSaved={isSaved(product.id)}
              onCapHit={handleCapHit}
              onToggle={(saved) => {
                if (saved) {
                  setSavedItems([...savedItems, { id: "temp", userId, productId: product.id, savedAt: new Date().toISOString() }]);
                } else {
                  setSavedItems(savedItems.filter((s) => s.productId !== product.id));
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
