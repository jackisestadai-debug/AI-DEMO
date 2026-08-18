import { company } from "@/lib/company";

export const metadata = { title: `Ångerrätt — ${company.brand}` };

export default function AngerrattPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ångerrätt</h1>

      <div className="prose prose-sm text-gray-600 space-y-6">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">14 dagars ångerrätt</h2>
          <p>
            Enligt lagen (2005:59) om distansavtal och avtal utanför affärslokaler
            har du som konsument rätt att ångra ditt köp inom 14 dagar från den
            dag du (eller ett ombud du utsett) tog emot varan, utan att behöva
            ange något skäl.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Hur du ångrar dig</h2>
          <p>
            Meddela oss via {company.email} innan ångerfristen löper ut. Skicka
            sedan tillbaka varan i väsentligen oförändrat skick inom 14 dagar
            efter att du meddelat oss. Du står för returfrakten om du inte
            avtalat annat med oss, om inte varan var felaktig.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Återbetalning</h2>
          <p>
            Vi återbetalar hela köpesumman (inklusive ursprunglig standardfrakt)
            senast 14 dagar efter att vi tagit emot returen eller fått bevis på
            att den skickats, med samma betalmetod du använde vid köpet.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Undantag från ångerrätten</h2>
          <p>
            Ångerrätten gäller inte för förseglade varor som av hälso- eller
            hygienskäl inte lämpar sig för retur om förseglingen brutits efter
            leverans. Det gäller till exempel öppnade förpackningar med muntejp
            och liknande produkter som är i direkt kontakt med huden.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Reklamation</h2>
          <p>
            Om en vara är felaktig eller skadad vid leverans har du utöver
            ångerrätten rätt att reklamera enligt konsumentköplagen. Kontakta
            oss på {company.email} så löser vi det.
          </p>
        </section>
      </div>
    </main>
  );
}
