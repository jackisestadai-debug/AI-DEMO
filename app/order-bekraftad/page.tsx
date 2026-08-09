export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const reference = params.order ?? params.session_id;

  return (
    <main className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Tack för din beställning!</h1>
      <p className="text-gray-500">
        Vi hör av oss på mejl så snart din order är på väg.
      </p>
      {reference && (
        <p className="text-xs text-gray-400 mt-6">Ordernummer: {reference}</p>
      )}
    </main>
  );
}
