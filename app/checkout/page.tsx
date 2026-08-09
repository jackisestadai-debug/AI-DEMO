"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel.");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      clear();
      router.push(`/order-bekraftad?order=${data.orderId ?? ""}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center text-gray-500">
        Din varukorg är tom.
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Kassan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Namn"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="E-post"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Adress"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <div className="flex gap-3">
          <input
            required
            placeholder="Postnummer"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Ort"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-500 text-sm">Att betala</span>
          <span className="font-semibold text-gray-900">{totalPrice} kr</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-full px-6 py-3 font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Bearbetar..." : "Betala"}
        </button>
      </form>
    </main>
  );
}
