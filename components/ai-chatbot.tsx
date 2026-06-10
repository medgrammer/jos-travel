"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { brand } from "@/lib/site-data";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content: "Bonjour, bienvenue chez JOS Travel. Dites-moi votre destination, vos dates ou votre besoin, et je vous guide."
};

const handoffKeywords = [
  "whatsapp",
  "conseiller",
  "réserver",
  "réservation",
  "devis",
  "appel",
  "contacter",
  "visa",
  "billet",
  "prix",
  "disponibilité",
  "documents",
  "pas disponible"
];

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const showWhatsAppHandoff =
    !loading &&
    Boolean(lastUserMessage) &&
    Boolean(latestAssistantMessage) &&
    shouldSuggestWhatsAppHandoff(latestAssistantMessage?.content ?? "");

  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollToLatest = () => {
      latestMessageRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

      const viewport = messagesViewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    };

    const frame = window.requestAnimationFrame(scrollToLatest);
    const timeout = window.setTimeout(scrollToLatest, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [open, messages, loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) {
      return;
    }

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMessages })
    }).catch(() => null);

    const payload = response ? await response.json().catch(() => null) : null;
    const answer =
      response?.ok && payload?.answer
        ? payload.answer
        : payload?.error ?? "JOS Travel n'est pas disponible pour le moment.";

    setMessages((state) => [...state, { role: "assistant", content: answer }]);
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la discussion JOS Travel"
        className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green-400 to-cyan-500 text-white shadow-2xl shadow-green-500/40 transition hover:scale-110"
      >
        <MessageCircle aria-hidden="true" className="h-8 w-8" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ocean-950/30 px-3 pb-3 backdrop-blur-sm md:items-center md:p-4">
          <section className="flex h-[82svh] w-full max-w-xl flex-col overflow-hidden rounded-[8px] border border-cyan-100 bg-white shadow-lift md:h-[680px]">
            <header className="flex items-center justify-between border-b border-cyan-100 bg-cyan-50/70 p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-ocean-700 shadow-sm">
                  <Sparkles aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-ocean-950">JOS Travel</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer la discussion"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ocean-950"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </header>

            <div ref={messagesViewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f8fcfd] p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <p
                    className={
                      message.role === "user"
                        ? "max-w-[82%] rounded-[8px] bg-ocean-950 px-4 py-3 text-sm leading-6 text-white"
                        : "max-w-[86%] rounded-[8px] border border-cyan-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm"
                    }
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <p className="inline-flex items-center gap-2 rounded-[8px] border border-cyan-100 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    JOS Travel rédige une réponse...
                  </p>
                </div>
              ) : null}

              {showWhatsAppHandoff ? (
                <div className="flex justify-start">
                  <a
                    href={buildWhatsAppHandoffUrl(lastUserMessage?.content)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-[86%] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                    Poursuivre avec un conseiller sur WhatsApp
                  </a>
                </div>
              ) : null}
              <div ref={latestMessageRef} aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3 border-t border-cyan-100 bg-white p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ex. Je veux voyager à Paris en août..."
                className="min-h-12 flex-1 rounded-full border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun-500 text-white transition hover:bg-sun-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}

function buildWhatsAppHandoffUrl(lastNeed?: string) {
  const text = [
    "Bonjour JOS Travel, je souhaite poursuivre cet échange sur WhatsApp avec un conseiller.",
    lastNeed ? `Mon besoin : ${lastNeed.slice(0, 240)}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
}

function shouldSuggestWhatsAppHandoff(content: string) {
  const normalized = content.toLowerCase();

  return handoffKeywords.some((keyword) => normalized.includes(keyword));
}
