import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DEFAULT_CARD, type CardData } from "@/lib/card-types";
import { encodeCard } from "@/lib/share-link";
import CardBuilder from "@/components/CardBuilder";
import CardRenderer from "@/components/CardRenderer";
import { Eye, Pencil, Copy, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Build a Wish Card — Lovecard" },
      { name: "description", content: "Create a custom interactive wish card for someone you love." },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const enc = encodeCard(card);
    return `${window.location.origin}/card?d=${enc}`;
  }, [card]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="app-bg min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_oklab,var(--cream)_75%,transparent)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-[var(--font-display)] text-xl">
            <Sparkles size={18} className="text-[var(--gold-dark)]" /> Lovecard
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex bg-[var(--cream-dark)] rounded-full p-1 lg:hidden">
              <button onClick={() => setTab("edit")} className={`px-3 py-1.5 text-sm rounded-full ${tab === "edit" ? "bg-[var(--card)] shadow" : ""}`}>
                <Pencil size={14} className="inline mr-1" /> Edit
              </button>
              <button onClick={() => setTab("preview")} className={`px-3 py-1.5 text-sm rounded-full ${tab === "preview" ? "bg-[var(--card)] shadow" : ""}`}>
                <Eye size={14} className="inline mr-1" /> Preview
              </button>
            </div>
            <button className="btn-sage" onClick={copy}>
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy share link</>}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        <div className={`${tab === "edit" ? "" : "hidden lg:block"}`}>
          <CardBuilder card={card} onChange={setCard} />
        </div>
        <div className={`${tab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="lg:sticky lg:top-20">
            <div className="rounded-3xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-elegant)] max-h-[calc(100vh-7rem)] overflow-y-auto">
              <CardRenderer card={card} preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
