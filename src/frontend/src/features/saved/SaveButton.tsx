import { useState } from "react";
import { saveProduct, unsaveProduct } from "../products/api";

interface SaveButtonProps {
  userId: string;
  productId: string;
  isSaved: boolean;
  onToggle?: (saved: boolean) => void;
  onCapHit?: () => void;
}

export function SaveButton({ userId, productId, isSaved, onToggle, onCapHit }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [savedState, setSavedState] = useState(isSaved);

  const handleToggle = async () => {
    if (saving) return;
    
    const newState = !savedState;
    setSaving(true);
    setSavedState(newState);
    onToggle?.(newState);

    try {
      if (newState) {
        const response = await saveProduct(userId, productId);
        if (response.status === 409) {
          // Cap hit - revert and notify
          setSavedState(false);
          onToggle?.(false);
          onCapHit?.();
        }
      } else {
        await unsaveProduct(userId, productId);
      }
    } catch (error) {
      // Revert on failure
      setSavedState(!newState);
      onToggle?.(!newState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      className="save-button"
      onClick={handleToggle}
      disabled={saving}
      data-testid={`save-button-${productId}`}
    >
      {savedState ? "Unsave" : "Save for Later"}
    </button>
  );
}


