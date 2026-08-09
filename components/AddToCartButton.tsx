"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  slug,
  size = "sm",
}: {
  slug: string;
  size?: "sm" | "lg";
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      onClick={handleClick}
      className={`font-medium bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors ${
        size === "lg" ? "px-6 py-3 text-sm w-full" : "px-4 py-2 text-sm"
      }`}
    >
      {added ? "Tillagd ✓" : "Lägg i korg"}
    </button>
  );
}
