import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DEFAULT_CARD, type CardData } from "@/lib/card-types";
import { saveCard } from "@/lib/card-storage";
import CardBuilder from "@/components/CardBuilder";
import CardRenderer from "@/components/CardRenderer";
import { Eye, Pencil, Copy, Check, Sparkles, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";

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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const publish = async () => {
    setSaving(true);
    try {
      const shortId = await saveCard(card);
      const url = `${window.location.origin}/c/${shortId}`;
      setShareUrl(url);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      toast.success("Card published! Link copied.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't publish card";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const copyAgain = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Any change after publishing invalidates the saved link.
  const handleCardChange = (next: CardData) => {
    setCard(next);
    if (shareUrl) setShareUrl(null);
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
            {shareUrl ? (
              <button className="btn-sage" onClick={copyAgain}>
                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy link</>}
              </button>
            ) : (
              <button className="btn-sage" onClick={publish} disabled={saving}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : <><Share2 size={16} /> Publish & share</>}
              </button>
            )}
          </div>
        </div>
        {shareUrl && (
          <div className="max-w-6xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2 bg-[var(--cream-dark)] rounded-xl px-3 py-2 text-sm">
              <span className="text-[var(--warm-gray)] text-xs uppercase tracking-wider mr-1">Share link</span>
              <code className="flex-1 truncate text-[var(--gold-dark)]">{shareUrl}</code>
              <a href={shareUrl} target="_blank" rel="noreferrer" className="btn-ghost-soft">Open</a>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        <div className={`${tab === "edit" ? "" : "hidden lg:block"}`}>
          <CardBuilder card={card} onChange={handleCardChange} />
        </div>
        <div className={`${tab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-elegant)] max-h-[calc(100vh-8rem)] overflow-y-auto">
              <CardRenderer card={card} preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
