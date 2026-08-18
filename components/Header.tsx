"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          🌙 Drömro
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Varukorg
          {totalItems > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
