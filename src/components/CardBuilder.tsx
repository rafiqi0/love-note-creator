import { useState } from "react";
import type { CardData, Checkpoint, ThemeName } from "@/lib/card-types";
import { Plus, Trash2, ChevronDown, ChevronUp, Image as ImgIcon } from "lucide-react";

const THEMES: { id: ThemeName; label: string; swatch: string[] }[] = [
  { id: "cream", label: "Warm Cream", swatch: ["#F5EFD9", "#C9A84C", "#7A9E7E"] },
  { id: "rose", label: "Rose", swatch: ["#FBE9E7", "#E57373", "#C2185B"] },
  { id: "ocean", label: "Ocean", swatch: ["#DCEEFB", "#4FA3D1", "#1E5A8A"] },
  { id: "forest", label: "Forest", swatch: ["#E6EEDF", "#7A9E7E", "#3F6044"] },
  { id: "midnight", label: "Midnight", swatch: ["#1F1B2E", "#9B7EBD", "#FFCB6B"] },
];

interface Props {
  card: CardData;
  onChange: (c: CardData) => void;
}

const newId = () => Math.random().toString(36).slice(2, 9);

export default function CardBuilder({ card, onChange }: Props) {
  const update = (patch: Partial<CardData>) => onChange({ ...card, ...patch });
  const updateCp = (i: number, patch: Partial<Checkpoint>) => {
    const next = [...card.checkpoints];
    next[i] = { ...next[i], ...patch } as Checkpoint;
    update({ checkpoints: next });
  };
  const removeCp = (i: number) => update({ checkpoints: card.checkpoints.filter((_, idx) => idx !== i) });
  const addCp = (type: Checkpoint["type"]) => {
    const base = { id: newId(), title: "New Checkpoint", subtitle: "Tell them what to do", icon: "✨" };
    let cp: Checkpoint;
    if (type === "photo") cp = { ...base, type: "photo", prompt: "Snap a memory", count: 1 };
    else if (type === "trivia") cp = { ...base, type: "trivia", icon: "🧠", questions: [{ q: "Question?", opts: ["A", "B", "C", "D"], ans: 0 }] };
    else if (type === "choice") cp = { ...base, type: "choice", icon: "🛍️", prompt: "Pick one", options: [{ label: "Option 1", emoji: "✨", desc: "" }, { label: "Option 2", emoji: "🌿", desc: "" }] };
    else cp = { ...base, type: "message", icon: "💌", message: "A little message…" };
    update({ checkpoints: [...card.checkpoints, cp] });
  };

  const handleHeroPhoto = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => update({ heroPhoto: ev.target?.result as string });
    r.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Section title="The basics">
        <Field label="Recipient name">
          <input className="field-input" value={card.recipientName} onChange={(e) => update({ recipientName: e.target.value })} />
        </Field>
        <Field label="Occasion">
          <input className="field-input" placeholder="e.g. 26th Birthday, Anniversary" value={card.occasion} onChange={(e) => update({ occasion: e.target.value })} />
        </Field>
        <Field label="From">
          <input className="field-input" value={card.fromName} onChange={(e) => update({ fromName: e.target.value })} />
        </Field>
        <Field label="Hero message (the big quote)">
          <input className="field-input" value={card.heroMessage} onChange={(e) => update({ heroMessage: e.target.value })} />
        </Field>
        <Field label="Sub-message">
          <textarea className="field-textarea" value={card.subMessage} onChange={(e) => update({ subMessage: e.target.value })} />
        </Field>
        <Field label="Hero photo">
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[var(--sage-light)] cursor-pointer bg-[color-mix(in_oklab,var(--sage)_5%,transparent)]">
            <ImgIcon size={18} />
            <span className="text-sm">{card.heroPhoto ? "Change photo" : "Upload a photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleHeroPhoto(e.target.files?.[0])} />
            {card.heroPhoto && <img src={card.heroPhoto} alt="" className="ml-auto w-12 h-12 rounded-lg object-cover" />}
          </label>
        </Field>
        <Field label="Unlock date (optional — leave empty to unlock instantly)">
          <input
            type="datetime-local"
            className="field-input"
            value={card.unlockDate ? card.unlockDate.slice(0, 16) : ""}
            onChange={(e) => update({ unlockDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </Field>
      </Section>

      <Section title="Theme">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ theme: t.id })}
              className={`p-3 rounded-xl border-2 text-left transition ${
                card.theme === t.id ? "border-[var(--gold)]" : "border-[var(--border)]"
              }`}
            >
              <div className="flex gap-1 mb-2">
                {t.swatch.map((c, i) => (
                  <span key={i} className="w-6 h-6 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="text-sm font-semibold">{t.label}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title={`Checkpoints (${card.checkpoints.length})`}>
        <div className="space-y-3">
          {card.checkpoints.map((cp, i) => (
            <CheckpointEditor
              key={cp.id}
              index={i}
              cp={cp}
              onChange={(patch) => updateCp(i, patch)}
              onRemove={() => removeCp(i)}
              onMove={(dir) => {
                const next = [...card.checkpoints];
                const ni = i + dir;
                if (ni < 0 || ni >= next.length) return;
                [next[i], next[ni]] = [next[ni], next[i]];
                update({ checkpoints: next });
              }}
            />
          ))}
        </div>
        <div className="divider-soft" />
        <p className="field-label">Add a checkpoint</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost-soft justify-center" onClick={() => addCp("choice")}><Plus size={14} /> Choice</button>
          <button className="btn-ghost-soft justify-center" onClick={() => addCp("photo")}><Plus size={14} /> Photo</button>
          <button className="btn-ghost-soft justify-center" onClick={() => addCp("trivia")}><Plus size={14} /> Trivia</button>
          <button className="btn-ghost-soft justify-center" onClick={() => addCp("message")}><Plus size={14} /> Message</button>
        </div>
      </Section>

      <Section title="Finale">
        <Field label="Finale title">
          <input className="field-input" value={card.finaleTitle} onChange={(e) => update({ finaleTitle: e.target.value })} />
        </Field>
        <Field label="Finale message">
          <textarea className="field-textarea" value={card.finaleMessage} onChange={(e) => update({ finaleMessage: e.target.value })} />
        </Field>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-[var(--font-display)] text-xl mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function CheckpointEditor({
  index, cp, onChange, onRemove, onMove,
}: {
  index: number;
  cp: Checkpoint;
  onChange: (p: Partial<Checkpoint>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--border)] rounded-2xl bg-[color-mix(in_oklab,var(--card)_60%,transparent)]">
      <div className="flex items-center gap-2 p-3">
        <span className="text-2xl">{cp.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-[var(--warm-gray)]">CP {index + 1} · {cp.type}</p>
          <p className="font-semibold text-sm truncate">{cp.title}</p>
        </div>
        <button className="btn-ghost-soft" onClick={() => onMove(-1)} aria-label="Move up"><ChevronUp size={14} /></button>
        <button className="btn-ghost-soft" onClick={() => onMove(1)} aria-label="Move down"><ChevronDown size={14} /></button>
        <button className="btn-ghost-soft" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Edit"}</button>
        <button className="btn-ghost-soft text-[var(--destructive)]" onClick={onRemove} aria-label="Remove"><Trash2 size={14} /></button>
      </div>
      {open && (
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-2">
            <input className="field-input text-center text-xl" value={cp.icon} onChange={(e) => onChange({ icon: e.target.value })} />
            <input className="field-input" value={cp.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Title" />
          </div>
          <input className="field-input" value={cp.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} placeholder="Subtitle" />

          {cp.type === "photo" && (
            <>
              <input className="field-input" value={cp.prompt} onChange={(e) => onChange({ prompt: e.target.value })} placeholder="Prompt" />
              <Field label="How many photos?">
                <input
                  type="number" min={1} max={10}
                  className="field-input"
                  value={cp.count}
                  onChange={(e) => onChange({ count: Math.max(1, Math.min(10, +e.target.value || 1)) })}
                />
              </Field>
            </>
          )}

          {cp.type === "choice" && (
            <>
              <input className="field-input" value={cp.prompt} onChange={(e) => onChange({ prompt: e.target.value })} placeholder="Prompt" />
              <p className="field-label">Options</p>
              {cp.options.map((o, oi) => (
                <div key={oi} className="grid grid-cols-[60px_1fr_1fr_auto] gap-2 items-center">
                  <input className="field-input text-center" value={o.emoji} onChange={(e) => {
                    const opts = [...cp.options]; opts[oi] = { ...o, emoji: e.target.value }; onChange({ options: opts });
                  }} />
                  <input className="field-input" placeholder="Label" value={o.label} onChange={(e) => {
                    const opts = [...cp.options]; opts[oi] = { ...o, label: e.target.value }; onChange({ options: opts });
                  }} />
                  <input className="field-input" placeholder="Description" value={o.desc} onChange={(e) => {
                    const opts = [...cp.options]; opts[oi] = { ...o, desc: e.target.value }; onChange({ options: opts });
                  }} />
                  <button className="btn-ghost-soft" onClick={() => onChange({ options: cp.options.filter((_, k) => k !== oi) })}><Trash2 size={14} /></button>
                </div>
              ))}
              <button className="btn-ghost-soft" onClick={() => onChange({ options: [...cp.options, { label: "New", emoji: "✨", desc: "" }] })}>
                <Plus size={14} /> Add option
              </button>
            </>
          )}

          {cp.type === "trivia" && (
            <>
              <p className="field-label">Questions</p>
              {cp.questions.map((q, qi) => (
                <div key={qi} className="border border-[var(--border)] rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input className="field-input flex-1" placeholder="Question" value={q.q} onChange={(e) => {
                      const qs = [...cp.questions]; qs[qi] = { ...q, q: e.target.value }; onChange({ questions: qs });
                    }} />
                    <button className="btn-ghost-soft" onClick={() => onChange({ questions: cp.questions.filter((_, k) => k !== qi) })}><Trash2 size={14} /></button>
                  </div>
                  {q.opts.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={q.ans === oi}
                        onChange={() => {
                          const qs = [...cp.questions]; qs[qi] = { ...q, ans: oi }; onChange({ questions: qs });
                        }}
                      />
                      <input className="field-input flex-1" value={opt} onChange={(e) => {
                        const qs = [...cp.questions];
                        const opts = [...q.opts]; opts[oi] = e.target.value;
                        qs[qi] = { ...q, opts }; onChange({ questions: qs });
                      }} />
                    </label>
                  ))}
                  <p className="text-xs text-[var(--warm-gray)]">Tick the correct answer above</p>
                </div>
              ))}
              <button className="btn-ghost-soft" onClick={() => onChange({ questions: [...cp.questions, { q: "Question?", opts: ["A", "B", "C", "D"], ans: 0 }] })}>
                <Plus size={14} /> Add question
              </button>
            </>
          )}

          {cp.type === "message" && (
            <>
              <textarea className="field-textarea" value={cp.message} onChange={(e) => onChange({ message: e.target.value })} placeholder="Your message" />
              <div className="grid grid-cols-2 gap-2">
                <input className="field-input" placeholder="CTA label (optional)" value={cp.cta || ""} onChange={(e) => onChange({ cta: e.target.value })} />
                <input className="field-input" placeholder="CTA URL (optional)" value={cp.ctaUrl || ""} onChange={(e) => onChange({ ctaUrl: e.target.value })} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
