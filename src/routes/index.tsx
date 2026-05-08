import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Camera, Brain, Gift, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovecard — Make a wish card someone will actually open" },
      { name: "description", content: "Build a customizable, interactive wish card for your loved one. Add photos, mini-games, themes, and share with a link." },
      { property: "og:title", content: "Lovecard — Wish cards, reinvented" },
      { property: "og:description", content: "An interactive birthday/anniversary card builder. Photos, trivia, checkpoints — all yours." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="app-bg min-h-screen">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-[var(--font-display)] text-xl">
          <Sparkles size={18} className="text-[var(--gold-dark)]" /> Lovecard
        </Link>
        <Link to="/builder" className="ml-auto btn-sage">
          Start building <ArrowRight size={16} />
        </Link>
      </header>

      <main>
        <section className="max-w-3xl mx-auto px-6 pt-10 pb-16 text-center relative">
          <p className="font-[var(--font-serif-soft)] italic text-sm tracking-[0.4em] text-[var(--gold-dark)] mb-4">
            ✦   FOR THE ONE YOU LOVE   ✦
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold leading-tight">
            Make a wish card
            <br />
            <span className="italic text-[var(--gold-dark)]">they'll actually open.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--warm-gray)] max-w-xl mx-auto">
            Nobody writes paper cards anymore. Build a beautiful interactive card with photos,
            mini-games and checkpoints. Send it as a link.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/builder" className="btn-gold glow-pulse" style={{ width: "auto", padding: "16px 36px" }}>
              ✨ Build your card ✨
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-5">
          <Feature icon={<Camera />} title="Your photos" desc="Upload a hero photo of the two of you. Add photo missions to the quest." />
          <Feature icon={<Brain />} title="Custom mini-games" desc="Trivia about your relationship, choice prompts, photo missions, sweet messages." />
          <Feature icon={<Heart />} title="Themes & vibes" desc="Pick a theme that fits — warm cream, ocean, rose, forest, midnight." />
          <Feature icon={<Gift />} title="Add a countdown" desc="Set an unlock date so it opens on the special day." />
          <Feature icon={<Sparkles />} title="Share with a link" desc="One link contains the whole card — no signup, no login." />
          <Feature icon={<ArrowRight />} title="Free & instant" desc="Build, preview, copy. That's it." />
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="glass-card p-10">
            <h2 className="font-[var(--font-display)] text-3xl">Ready to make their day?</h2>
            <p className="mt-3 text-[var(--warm-gray)]">It takes 5 minutes. They'll remember it forever.</p>
            <Link to="/builder" className="btn-gold mt-6" style={{ display: "inline-flex", width: "auto", padding: "16px 36px" }}>
              Start building <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--warm-gray)]">
        Made with 💛 for the romantics.
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-6">
      <div className="w-11 h-11 rounded-xl bg-[var(--cream-dark)] flex items-center justify-center text-[var(--gold-dark)] mb-3">
        {icon}
      </div>
      <h3 className="font-[var(--font-display)] text-xl mb-1">{title}</h3>
      <p className="text-sm text-[var(--warm-gray)] leading-relaxed">{desc}</p>
    </div>
  );
}
