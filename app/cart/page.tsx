"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Din varukorg är tom.</p>
        <Link href="/" className="text-indigo-600 font-medium hover:underline">
          Fortsätt handla
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Din varukorg</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          if (!product) return null;
          return (
            <div
              key={item.slug}
              className="flex items-center gap-4 border border-gray-200 rounded-xl p-4"
            >
              <div
                className={`h-16 w-16 shrink-0 rounded-lg flex items-center justify-center text-3xl bg-gradient-to-br ${product.accent}`}
              >
                {product.emoji}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.price} kr</p>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.slug, parseInt(e.target.value) || 1)
                }
                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm"
              />
              <button
                onClick={() => removeItem(item.slug)}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                Ta bort
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <span className="font-semibold text-gray-900">Totalt</span>
        <span className="font-semibold text-gray-900">{totalPrice} kr</span>
      </div>
      <Link
        href="/checkout"
        className="mt-6 block text-center bg-gray-900 text-white rounded-full px-6 py-3 font-medium hover:bg-gray-700 transition-colors"
      >
        Gå till kassan
      </Link>
    </main>
  );
}
