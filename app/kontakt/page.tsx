import { company } from "@/lib/company";

export const metadata = { title: `Kontakt — ${company.brand}` };

export default function KontaktPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kontakt</h1>
      <p className="text-gray-600 mb-8">
        Har du frågor om din order, en produkt eller något annat? Hör av dig
        så svarar vi så snart vi kan.
      </p>
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-gray-400">E-post</dt>
          <dd className="text-gray-900 font-medium">{company.email}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Säljare</dt>
          <dd className="text-gray-900 font-medium">{company.legalName}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Organisationsnummer</dt>
          <dd className="text-gray-900 font-medium">{company.orgNumber}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Adress</dt>
          <dd className="text-gray-900 font-medium">{company.address}</dd>
        </div>
      </dl>
    </main>
  );
}
