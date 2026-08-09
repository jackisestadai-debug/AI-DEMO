import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 grid sm:grid-cols-2 gap-10">
      <div
        className={`aspect-square rounded-2xl flex items-center justify-center text-9xl bg-gradient-to-br ${product.accent}`}
      >
        {product.emoji}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-xl font-semibold text-gray-900">{product.price} kr</span>
          {product.compareAtPrice && (
            <span className="text-gray-400 line-through">{product.compareAtPrice} kr</span>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
        <AddToCartButton slug={product.slug} size="lg" />
      </div>
    </main>
  );
}
