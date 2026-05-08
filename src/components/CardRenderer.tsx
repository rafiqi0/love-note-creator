import { useEffect, useState } from "react";
import type { CardData, Checkpoint } from "@/lib/card-types";
import { fireConfetti } from "@/lib/confetti";
import { CheckCircle, Camera, Lock } from "lucide-react";

interface Props {
  card: CardData;
  preview?: boolean;
}

function FloatingDecos() {
  const items = [
    { t: "💛", cls: "fl-a", style: { top: "7%", left: "5%", fontSize: 22, opacity: 0.75 } },
    { t: "✦", cls: "twink", style: { top: "11%", right: "9%", fontSize: 18, color: "var(--gold)", opacity: 0.85 } },
    { t: "🌿", cls: "fl-b", style: { top: "19%", left: "3%", fontSize: 16, opacity: 0.55 } },
    { t: "✦", cls: "twink", style: { top: "23%", left: "15%", fontSize: 11, color: "var(--sage)", opacity: 0.7 } },
    { t: "🌸", cls: "fl-a", style: { top: "29%", right: "7%", fontSize: 15, opacity: 0.55 } },
    { t: "✦", cls: "twink", style: { top: "33%", right: "19%", fontSize: 10, color: "var(--gold-light)", opacity: 0.9 } },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((d, i) => (
        <span key={i} className={`absolute ${d.cls}`} style={d.style as React.CSSProperties}>
          {d.t}
        </span>
      ))}
    </div>
  );
}

function useCountdown(unlockISO?: string) {
  const target = unlockISO ? new Date(unlockISO).getTime() : 0;
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: !unlockISO || target <= Date.now() });
  useEffect(() => {
    if (!unlockISO) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0, done: true });
        return;
      }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        done: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unlockISO, target]);
  return t;
}

function Hero({ card }: { card: CardData }) {
  return (
    <div className="relative pt-12 pb-8 px-6 text-center">
      <FloatingDecos />
      <div className="relative">
        <p className="font-[var(--font-serif-soft)] italic text-sm tracking-[0.4em] text-[var(--gold-dark)] mb-4">
          ✦   A Day Made For You   ✦
        </p>
        <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold leading-tight">
          Happy {card.occasion},
        </h1>
        <h1 className="font-[var(--font-display)] italic text-5xl md:text-6xl text-[var(--gold-dark)] mt-1">
          {card.recipientName}!
        </h1>
        {card.heroPhoto && (
          <div className="mt-6 flex justify-center">
            <img
              src={card.heroPhoto}
              alt={card.recipientName}
              className="w-44 h-44 object-cover rounded-3xl shadow-[var(--shadow-elegant)] border-4 border-[var(--card)]"
            />
          </div>
        )}
        <p className="font-[var(--font-serif-soft)] italic text-xl mt-6 text-[var(--charcoal)] max-w-md mx-auto">
          "{card.heroMessage}"
        </p>
        <p className="text-sm text-[var(--warm-gray)] mt-4 max-w-sm mx-auto">{card.subMessage}</p>
        <p className="text-xs text-[var(--warm-gray)] mt-3 italic">— from {card.fromName}</p>
      </div>
    </div>
  );
}

function CountdownCard({ time, onStart }: { time: ReturnType<typeof useCountdown>; onStart: () => void }) {
  const unlocked = time.done;
  return (
    <div className="glass-card p-8 text-center">
      <div className="text-5xl mb-4">{unlocked ? "🎉" : "🗝️"}</div>
      <h2 className="font-[var(--font-display)] text-2xl mb-2">
        {unlocked ? "Your Quest Awaits!" : "Coming Soon…"}
      </h2>
      <p className="text-sm text-[var(--warm-gray)] mb-5">
        {unlocked
          ? "The path is open. Begin your odyssey."
          : "Your special journey unlocks very soon."}
      </p>
      {!unlocked && (
        <div className="flex justify-center gap-3 mb-6">
          {([["Days", time.d], ["Hrs", time.h], ["Min", time.m], ["Sec", time.s]] as const).map(([l, v]) => (
            <div key={l} className="bg-[var(--cream-dark)] rounded-2xl px-3 py-2 min-w-[58px]">
              <div className="text-2xl font-bold text-[var(--gold-dark)]">{String(v).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--warm-gray)]">{l}</div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onStart}
        disabled={!unlocked}
        className={`btn-gold ${unlocked ? "glow-pulse" : ""}`}
      >
        {unlocked ? "✨ Begin the Quest ✨" : <><Lock size={16} /> Locked</>}
      </button>
    </div>
  );
}

function CPHeader({ n, icon, title, subtitle }: { n: number; icon: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--cream-dark)] text-3xl mb-3">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-dark)] font-semibold">
        Checkpoint {n}
      </p>
      <h3 className="font-[var(--font-display)] text-2xl mt-1">{title}</h3>
      <p className="text-sm text-[var(--warm-gray)] mt-1">{subtitle}</p>
    </div>
  );
}

function DoneBadge({ label }: { label: string }) {
  return (
    <div className="text-center py-6">
      <CheckCircle className="mx-auto text-[var(--sage)]" size={48} />
      <p className="mt-2 font-semibold text-[var(--sage-dark)]">{label}</p>
      <p className="text-xs text-[var(--warm-gray)]">Scroll down to continue ↓</p>
    </div>
  );
}

function PhotoUpload({ onUpload, uploaded }: { onUpload: (d: string) => void; uploaded?: string }) {
  return (
    <label className="block border-2 border-dashed border-[var(--sage-light)] rounded-2xl p-4 text-center cursor-pointer bg-[color-mix(in_oklab,var(--sage)_4%,transparent)] hover:bg-[color-mix(in_oklab,var(--sage)_9%,transparent)] transition relative overflow-hidden min-h-[120px] flex items-center justify-center">
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = (ev) => onUpload(ev.target?.result as string);
          r.readAsDataURL(f);
        }}
      />
      {uploaded ? (
        <img src={uploaded} alt="" className="w-full h-32 object-cover rounded-xl" />
      ) : (
        <div>
          <Camera className="mx-auto text-[var(--sage)] mb-2" />
          <p className="text-sm text-[var(--warm-gray)]">Tap to upload</p>
        </div>
      )}
    </label>
  );
}

function CPRender({
  cp,
  index,
  done,
  onComplete,
}: {
  cp: Checkpoint;
  index: number;
  done: boolean;
  onComplete: () => void;
}) {
  const n = index + 1;

  if (cp.type === "choice") {
    const [pick, setPick] = useState<string | null>(null);
    const [photo, setPhoto] = useState<string | undefined>();
    return (
      <div className="glass-card p-7">
        <CPHeader n={n} icon={cp.icon} title={cp.title} subtitle={cp.subtitle} />
        {done ? <DoneBadge label="Checkpoint complete!" /> : (
          <>
            <p className="text-sm text-center mb-3 text-[var(--warm-gray)]">{cp.prompt}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {cp.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => setPick(o.label)}
                  className={`p-4 rounded-2xl border-2 text-center transition ${
                    pick === o.label
                      ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]"
                      : "border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_60%,transparent)]"
                  }`}
                >
                  <div className="text-3xl mb-1">{o.emoji}</div>
                  <div className="font-semibold text-sm">{o.label}</div>
                  <div className="text-xs text-[var(--warm-gray)] mt-1">{o.desc}</div>
                </button>
              ))}
            </div>
            {pick && (
              <>
                <p className="text-xs text-center text-[var(--warm-gray)] mb-2">
                  Optional: snap a photo of your pick
                </p>
                <PhotoUpload onUpload={setPhoto} uploaded={photo} />
                <button className="btn-gold mt-5" onClick={onComplete}>
                  Complete Checkpoint
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  if (cp.type === "photo") {
    const [photos, setPhotos] = useState<(string | undefined)[]>(Array(cp.count).fill(undefined));
    const all = photos.every(Boolean);
    return (
      <div className="glass-card p-7">
        <CPHeader n={n} icon={cp.icon} title={cp.title} subtitle={cp.subtitle} />
        {done ? <DoneBadge label="Photos captured!" /> : (
          <>
            <p className="text-sm text-center mb-4 text-[var(--warm-gray)]">{cp.prompt}</p>
            <div className="grid grid-cols-1 gap-3">
              {photos.map((p, i) => (
                <PhotoUpload
                  key={i}
                  uploaded={p}
                  onUpload={(d) => {
                    const next = [...photos];
                    next[i] = d;
                    setPhotos(next);
                  }}
                />
              ))}
            </div>
            <button className="btn-gold mt-5" disabled={!all} onClick={onComplete}>
              Complete Checkpoint
            </button>
            {!all && (
              <p className="text-center text-xs text-[var(--warm-gray)] mt-2">
                {photos.filter(Boolean).length}/{cp.count} uploaded
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  if (cp.type === "trivia") {
    const [answers, setAnswers] = useState<(number | null)[]>(Array(cp.questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const allRight = answers.every((a, i) => a === cp.questions[i].ans);
    return (
      <div className="glass-card p-7">
        <CPHeader n={n} icon={cp.icon} title={cp.title} subtitle={cp.subtitle} />
        {done ? <DoneBadge label="Trivia conquered!" /> : (
          <>
            <div className="space-y-5">
              {cp.questions.map((q, qi) => (
                <div key={qi}>
                  <p className="font-semibold text-sm mb-2">Q{qi + 1}: {q.q}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.opts.map((o, oi) => {
                      let cls = "border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_60%,transparent)]";
                      if (answers[qi] === oi) {
                        if (submitted) cls = oi === q.ans ? "border-[var(--sage)] bg-[color-mix(in_oklab,var(--sage)_15%,transparent)]" : "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]";
                        else cls = "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]";
                      } else if (submitted && oi === q.ans) {
                        cls = "border-[var(--sage)] bg-[color-mix(in_oklab,var(--sage)_12%,transparent)]";
                      }
                      return (
                        <button
                          key={oi}
                          onClick={() => !submitted && setAnswers((a) => { const n = [...a]; n[qi] = oi; return n; })}
                          className={`text-left rounded-xl border-2 px-4 py-3 text-sm transition ${cls}`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {submitted && !allRight && (
              <div className="text-center mt-4">
                <p className="text-sm text-[var(--warm-gray)]">Hmm, not quite! Try again 🌿</p>
                <button
                  onClick={() => { setSubmitted(false); setAnswers(Array(cp.questions.length).fill(null)); }}
                  className="text-sm text-[var(--sage-dark)] underline mt-2 font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}
            {!submitted ? (
              <button
                className="btn-gold mt-5"
                disabled={answers.some((a) => a === null)}
                onClick={() => {
                  setSubmitted(true);
                  if (allRight) setTimeout(onComplete, 800);
                }}
              >
                Submit Answers
              </button>
            ) : allRight ? (
              <p className="text-center text-[var(--sage-dark)] font-semibold mt-4">All correct! ✨</p>
            ) : null}
          </>
        )}
      </div>
    );
  }

  // message
  return (
    <div className="glass-card p-7 text-center">
      <CPHeader n={n} icon={cp.icon} title={cp.title} subtitle={cp.subtitle} />
      <p className="text-base leading-relaxed text-[var(--charcoal)] my-4">{cp.message}</p>
      {cp.ctaUrl && cp.cta && (
        <a href={cp.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-gold no-underline">
          {cp.cta}
        </a>
      )}
      {!done && (
        <button className="btn-sage mt-4" onClick={onComplete}>Mark as done</button>
      )}
      {done && <DoneBadge label="Quest complete!" />}
    </div>
  );
}

export default function CardRenderer({ card, preview }: Props) {
  const time = useCountdown(card.unlockDate);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // index of next checkpoint to do
  const [completed, setCompleted] = useState<number[]>([]);

  const total = card.checkpoints.length;
  const progress = Math.round((completed.length / total) * 100);

  const start = () => {
    fireConfetti();
    setStarted(true);
    setStep(0);
  };

  const completeCp = (i: number) => {
    fireConfetti();
    setCompleted((c) => [...c, i]);
    setStep(i + 1);
  };

  return (
    <div className="app-bg" data-theme={card.theme === "cream" ? undefined : card.theme}>
      <div className="max-w-xl mx-auto px-4 pb-20">
        {started && (
          <div className="pt-6 pb-2 sticky top-0 z-30 backdrop-blur-md">
            <div className="glass-card px-5 py-3 flex items-center justify-between">
              <span className="font-[var(--font-display)] text-sm">{card.recipientName}'s Quest</span>
              <span className="text-xs text-[var(--warm-gray)]">{progress}% Complete</span>
            </div>
            <div className="h-1.5 bg-[color-mix(in_oklab,var(--gold)_15%,transparent)] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,var(--sage),var(--gold))" }}
              />
            </div>
          </div>
        )}

        <Hero card={card} />

        {!started ? (
          <CountdownCard time={time} onStart={start} />
        ) : (
          <div className="space-y-6 mt-4">
            {card.checkpoints.map((cp, i) => {
              if (i > step) return null;
              return (
                <CPRender
                  key={cp.id}
                  cp={cp}
                  index={i}
                  done={completed.includes(i)}
                  onComplete={() => completeCp(i)}
                />
              );
            })}
            {completed.length === total && (
              <div className="glass-card p-8 text-center">
                <div className="text-5xl mb-3">🏆</div>
                <h3 className="font-[var(--font-display)] text-3xl">{card.finaleTitle}</h3>
                <p className="mt-3 text-[var(--warm-gray)] leading-relaxed">{card.finaleMessage}</p>
              </div>
            )}
          </div>
        )}

        {preview && (
          <div className="mt-6 text-center text-xs text-[var(--warm-gray)] italic">
            Live preview — your card will look like this
          </div>
        )}
      </div>
    </div>
  );
}
