import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadCard } from "@/lib/card-storage";
import type { CardData } from "@/lib/card-types";
import CardRenderer from "@/components/CardRenderer";
import { Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/c/$shortId")({
  head: () => ({
    meta: [
      { title: "A Wish Card For You 💌" },
      { name: "description", content: "Someone made you an interactive wish card. Open it!" },
      { property: "og:title", content: "A Wish Card For You 💌" },
      { property: "og:description", content: "Someone made you an interactive wish card." },
    ],
  }),
  component: CardView,
});

function CardView() {
  const { shortId } = useParams({ from: "/c/$shortId" });
  const [card, setCard] = useState<CardData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    loadCard(shortId)
      .then((c) => {
        if (cancelled) return;
        if (!c) setState("missing");
        else { setCard(c); setState("ready"); }
      })
      .catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [shortId]);

  if (state === "loading") {
    return (
      <div className="app-bg min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--gold-dark)]" size={32} />
      </div>
    );
  }

  if (state === "missing" || state === "error") {
    return (
      <div className="app-bg min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="text-5xl mb-3">💔</div>
          <h1 className="font-[var(--font-display)] text-2xl">
            {state === "missing" ? "Card not found" : "Something went wrong"}
          </h1>
          <p className="mt-2 text-sm text-[var(--warm-gray)]">
            {state === "missing"
              ? "The link might be wrong, or the card was never published."
              : "Please try again in a moment."}
          </p>
          <Link to="/" className="btn-sage mt-6 inline-flex">
            <Sparkles size={14} /> Make your own
          </Link>
        </div>
      </div>
    );
  }

  return <CardRenderer card={card!} />;
}
