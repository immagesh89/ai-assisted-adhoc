import { useEffect, useState } from "react";
import { fetchSavedItems, fetchProducts, unsaveProduct, type SavedItem } from "../products/api";
import type { Product } from "../products/types";
import { SaveButton } from "./SaveButton";

interface SavedProductsListProps {
  userId: string;
}

export function SavedProductsList({ userId }: SavedProductsListProps) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchSavedItems(userId), fetchProducts()])
      .then(([saved, prods]) => {
        if (!cancelled) {
          setSavedItems(saved);
          setProducts(prods);
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
  }, [userId]);

  const handleUnsave = async (productId: string) => {
    const prevSaved = savedItems;
    setSavedItems(prevSaved.filter((s) => s.productId !== productId));
    try {
      await unsaveProduct(userId, productId);
    } catch (error) {
      setSavedItems(prevSaved);
    }
  };

  const handleCapHit = () => {
    setMessage("Cannot save more than 20 items.");
    setTimeout(() => setMessage(""), 3000);
  };

  if (status === "loading") {
    return <p className="status-message">Loading saved products.</p>;
  }

  if (status === "error") {
    return (
      <p className="status-message">
        Couldn't load saved products. Is the API running?
      </p>
    );
  }

  if (savedItems.length === 0) {
    return <p className="status-message">No products saved yet.</p>;
  }

  const getProduct = (productId: string) => products.find((p) => p.id === productId);

  return (
    <div>
      {message && <p className="status-message" role="alert">{message}</p>}
      <div className="product-grid">
        {savedItems.map((savedItem) => {
          const product = getProduct(savedItem.productId);
          if (!product) return null;
          return (
            <article key={savedItem.id} className="product-card" data-testid="saved-product-card">
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price"></p>
              <SaveButton
                userId={userId}
                productId={product.id}
                isSaved={true}
                onToggle={(saved) => {
                  if (!saved) {
                    handleUnsave(product.id);
                  }
                }}
                onCapHit={handleCapHit}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
