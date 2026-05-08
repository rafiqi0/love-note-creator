export type ThemeName = "cream" | "ocean" | "rose" | "midnight" | "forest";

export type Checkpoint =
  | { id: string; type: "photo"; title: string; subtitle: string; icon: string; prompt: string; count: number }
  | { id: string; type: "trivia"; title: string; subtitle: string; icon: string; questions: { q: string; opts: string[]; ans: number }[] }
  | { id: string; type: "choice"; title: string; subtitle: string; icon: string; prompt: string; options: { label: string; emoji: string; desc: string }[] }
  | { id: string; type: "message"; title: string; subtitle: string; icon: string; message: string; cta?: string; ctaUrl?: string };

export interface CardData {
  recipientName: string;
  occasion: string; // e.g. "26th Birthday"
  fromName: string;
  heroMessage: string;
  subMessage: string;
  heroPhoto?: string; // data URL or image URL
  theme: ThemeName;
  unlockDate?: string; // ISO; if empty, unlocked immediately
  checkpoints: Checkpoint[];
  finaleTitle: string;
  finaleMessage: string;
}

export const DEFAULT_CARD: CardData = {
  recipientName: "Sayang",
  occasion: "Birthday",
  fromName: "Me",
  heroMessage: "Happy Birthday!",
  subMessage: "I love you to the moon and Pluto.",
  theme: "cream",
  checkpoints: [
    {
      id: "cp1",
      type: "choice",
      icon: "👗",
      title: "The Style Procurement",
      subtitle: "Find your outfit for the day ✨",
      prompt: "Pick your shopping destination",
      options: [
        { label: "Online", emoji: "🛍️", desc: "Browse from the couch" },
        { label: "Mall", emoji: "🏬", desc: "Try things on" },
        { label: "Boutique", emoji: "👜", desc: "Something unique" },
      ],
    },
    {
      id: "cp2",
      type: "photo",
      icon: "📸",
      title: "Capture the Moment",
      subtitle: "Three memories from the day 💐",
      prompt: "Snap & upload",
      count: 3,
    },
    {
      id: "cp3",
      type: "trivia",
      icon: "🧠",
      title: "How Well Do We Know…",
      subtitle: "A little quiz, just for fun",
      questions: [
        { q: "Our first date was at…", opts: ["A café", "The cinema", "A park", "Their place"], ans: 0 },
        { q: "My favourite thing about you?", opts: ["Your laugh", "Your eyes", "Your kindness", "All of it"], ans: 3 },
      ],
    },
    {
      id: "cp4",
      type: "message",
      icon: "🎁",
      title: "The Finale",
      subtitle: "Your odyssey reaches its peak",
      message: "You did it 🎉 Thank you for being you. Here's to many more adventures together.",
    },
  ],
  finaleTitle: "You did it! 🎉",
  finaleMessage: "Thank you for completing every checkpoint. You are loved.",
};
