"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-lg font-bold tracking-tight">SetterAI</span>
        <Link
          href="/demo"
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Testa gratis
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          AI Appointment Setter
        </div>
        <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
          Din AI bokar möten.<br />Du stänger affärer.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          SetterAI pratar med dina leads dygnet runt, kvalificerar dem och bokar in möten i din kalender — utan att du lyfter ett finger.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/demo"
            className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-700 transition-colors text-base"
          >
            Se hur det funkar →
          </Link>
          <a
            href="#kontakt"
            className="bg-gray-100 text-gray-800 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-200 transition-colors text-base"
          >
            Boka ett samtal
          </a>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="bg-gray-50 border-y border-gray-100 py-6">
        <p className="text-center text-sm text-gray-400 font-medium">
          Funkar för coaches · konsulter · byråer · fastighetsmäklare · tandläkare
        </p>
      </div>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Så fungerar det</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              step: "1",
              title: "Lead skriver till dig",
              desc: "Via din hemsida, Instagram, Facebook eller WhatsApp. AI:n svarar direkt — sekunder, inte timmar.",
            },
            {
              step: "2",
              title: "AI:n kvalificerar",
              desc: "Den ställer rätt frågor, förstår behovet och avgör om leadet passar din tjänst.",
            },
            {
              step: "3",
              title: "Möte bokas",
              desc: "När leadet är redo skickar AI:n din bokningslänk och guidar dem hela vägen till ett bekräftat möte.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-start">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-5">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Varför SetterAI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Aldrig mer missade leads",
                desc: "AI:n svarar inom sekunder, oavsett om klockan är 02:00 eller mitt i din semester.",
              },
              {
                title: "Anpassad efter ditt företag",
                desc: "Du tränar AI:n med ditt eget språk, dina sälj-SOP:ar och din röst. Den låter som du.",
              },
              {
                title: "Alla konversationer sparade",
                desc: "Se exakt vad varje lead har sagt, var de är i processen och hur många möten som bokats.",
              },
              {
                title: "Inga tekniska kunskaper krävs",
                desc: "Vi sätter upp allt åt dig. Du behöver inte röra en enda rad kod.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Testa AI:n nu — direkt i din webbläsare</h2>
        <p className="text-gray-500 mb-8 text-lg">
          Klicka nedan och prata med en live-version av SetterAI. Inget konto krävs.
        </p>
        <Link
          href="/demo"
          className="inline-block bg-blue-600 text-white font-semibold px-10 py-4 rounded-full hover:bg-blue-700 transition-colors text-base"
        >
          Starta demo →
        </Link>
      </section>

      {/* Contact */}
      <section id="kontakt" className="bg-gray-50 border-t border-gray-100 py-24">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att komma igång?</h2>
          <p className="text-gray-500 mb-10">
            Fyll i formuläret så hör vi av oss inom 24 timmar.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const msg = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
              alert(`Tack ${name}! Vi hör av oss till ${email} snart.\n\n"${msg}"`);
              form.reset();
            }}
            className="flex flex-col gap-4 text-left"
          >
            <input
              name="name"
              required
              type="text"
              placeholder="Ditt namn"
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Din e-postadress"
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Berätta kort om ditt företag och vad du vill uppnå"
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Skicka →
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2026 SetterAI. Alla rättigheter förbehållna.
      </footer>
    </div>
  );
}
