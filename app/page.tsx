import Link from "next/link";
import { products } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4">
      <section className="py-16 text-center">
        <p className="text-sm font-medium text-indigo-600 mb-3">
          Sov djupare. Vakna piggare.
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Enkla prylar för riktigt bra sömn
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Handplockade produkter som hjälper dig somna snabbare och sova lugnare,
          natt efter natt.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {products.map((product) => (
          <div
            key={product.slug}
            className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition-shadow"
          >
            <Link href={`/produkter/${product.slug}`}>
              <div
                className={`relative h-48 flex items-center justify-center text-6xl bg-gradient-to-br ${product.accent}`}
              >
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                    🔥 Populär
                  </span>
                )}
                {product.emoji}
              </div>
            </Link>
            <div className="p-5">
              <Link href={`/produkter/${product.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{product.price} kr</span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.compareAtPrice} kr
                    </span>
                  )}
                </div>
                <AddToCartButton slug={product.slug} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
