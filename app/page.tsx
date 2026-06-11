"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
}

const BOOKING_LINK = process.env.NEXT_PUBLIC_BOOKING_LINK ?? "https://calendly.com/din-länk";

const BOOKING_TRIGGERS = [
  "calendly", "boka", "bokningslänk", "länk till", "klicka här",
  "ta en titt", "kolla in länken",
];

function containsBookingTrigger(text: string) {
  return BOOKING_TRIGGERS.some((t) => text.toLowerCase().includes(t));
}

function renderWithBookingLink(text: string) {
  if (!containsBookingTrigger(text)) return <span>{text}</span>;

  return (
    <>
      <span>{text}</span>
      <a
        href={BOOKING_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-3 py-2 text-xs font-medium underline-offset-2 underline"
      >
        📅 Boka ditt samtal här
      </a>
    </>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadInfo] = useState<LeadInfo>({});
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-greet on load
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "__init__" }],
            leadId: null,
            leadInfo,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          setMessages([{ role: "assistant", content: data.reply }]);
        }
        if (data.leadId) setLeadId(data.leadId);
      } catch {
        setMessages([{ role: "assistant", content: "Hej! Hur kan jag hjälpa dig?" }]);
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, leadId, leadInfo }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      }
      if (data.leadId) setLeadId(data.leadId);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Något gick fel. Försök igen." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Instagram-style header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-black">
        {/* Back arrow */}
        <button className="text-white mr-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
        </div>

        {/* Name + active status */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">Alex</p>
          <p className="text-neutral-400 text-xs">Aktiv nu</p>
        </div>

        {/* Info button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </button>
      </header>

      {/* Info panel (collapsible) */}
      {showInfo && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 text-xs text-neutral-400 space-y-1">
          <p className="text-white font-medium text-sm mb-1">Om Alex</p>
          <p>Hjälper kliniker &amp; salonger att automatisera sin mötesbokning med AI.</p>
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-pink-400 font-medium mt-1"
          >
            📅 Boka ett gratis samtal
          </a>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-black">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
              A
            </div>
            <p className="text-white font-semibold">Alex</p>
            <p className="text-neutral-400 text-sm max-w-xs">
              Skicka ett meddelande för att starta konversationen.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar for assistant */}
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex-shrink-0 mb-1 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            )}

            <div
              className={`max-w-[72%] px-4 py-2.5 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap flex flex-col gap-1 ${
                msg.role === "user"
                  ? "bg-[#3797F0] text-white rounded-br-lg"
                  : "bg-neutral-800 text-white rounded-bl-lg"
              }`}
            >
              {msg.role === "assistant"
                ? renderWithBookingLink(msg.content)
                : <span>{msg.content}</span>}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex-shrink-0 mb-1 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="bg-neutral-800 rounded-3xl rounded-bl-lg px-4 py-3">
              <div className="flex space-x-1.5 items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Instagram-style input bar */}
      <form
        onSubmit={sendMessage}
        className="bg-black border-t border-neutral-800 px-3 py-3"
      >
        <div className="flex items-center gap-2">
          {/* Emoji button (decorative) */}
          <button type="button" className="text-neutral-400 hover:text-white transition-colors flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skicka ett meddelande..."
            disabled={loading}
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 disabled:opacity-50"
          />

          {input.trim() ? (
            <button
              type="submit"
              disabled={loading}
              className="text-[#3797F0] font-semibold text-sm flex-shrink-0 hover:text-blue-300 transition-colors disabled:opacity-40"
            >
              Skicka
            </button>
          ) : (
            <div className="flex gap-3 text-neutral-400 flex-shrink-0">
              {/* Mic icon */}
              <button type="button" className="hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              {/* Image icon */}
              <button type="button" className="hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
