import LZString from "lz-string";
import type { CardData } from "./card-types";

export function encodeCard(card: CardData): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(card));
}

export function decodeCard(encoded: string): CardData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as CardData;
  } catch {
    return null;
  }
}
