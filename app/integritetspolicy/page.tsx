import { company } from "@/lib/company";

export const metadata = { title: `Integritetspolicy — ${company.brand}` };

export default function IntegritetspolicyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Integritetspolicy</h1>

      <div className="prose prose-sm text-gray-600 space-y-6">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Vem är personuppgiftsansvarig</h2>
          <p>
            {company.legalName} (org.nr {company.orgNumber}) är
            personuppgiftsansvarig för de uppgifter du lämnar när du handlar hos{" "}
            {company.brand}. Frågor om dina uppgifter besvaras på {company.email}.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Vilka uppgifter vi samlar in</h2>
          <p>
            När du genomför ett köp samlar vi in namn, e-postadress,
            telefonnummer och leveransadress. Betalningsuppgifter hanteras
            direkt av vår betalleverantör Stripe — vi lagrar aldrig kortnummer
            själva.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Varför vi behandlar uppgifterna</h2>
          <p>
            Uppgifterna används för att fullgöra köpeavtalet: skicka din order
            till vår leverantör för leverans, hantera betalning och kunna
            kontakta dig om din order. Den rättsliga grunden är fullgörande av
            avtal.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Vilka vi delar uppgifter med</h2>
          <p>
            Namn, adress och telefonnummer delas med vår fraktleverantör/
            dropshipping-partner (CJdropshipping) för att kunna leverera din
            order, och betalningsuppgifter behandlas av Stripe. Vi säljer
            aldrig dina uppgifter vidare.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Hur länge vi sparar uppgifterna</h2>
          <p>
            Orderuppgifter sparas så länge det krävs för att uppfylla
            bokföringslagens krav (normalt sju år), därefter raderas de.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Dina rättigheter</h2>
          <p>
            Du har rätt att begära tillgång till, rättelse av eller radering av
            dina uppgifter, samt rätt att invända mot eller begränsa
            behandlingen. Kontakta oss på {company.email}. Du har även rätt att
            klaga till Integritetsskyddsmyndigheten (IMY).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Cookies</h2>
          <p>
            Din varukorg sparas lokalt i din webbläsare (localStorage), inte i
            en spårande cookie. Om vi i framtiden lägger till
            analys- eller annonsverktyg uppdaterar vi den här sidan och ber om
            samtycke där det krävs.
          </p>
        </section>
      </div>
    </main>
  );
}
