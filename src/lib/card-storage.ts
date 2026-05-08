import { supabase } from "@/integrations/supabase/client";
import type { CardData } from "./card-types";

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no 0/o/1/l confusables

function generateShortId(len = 8): string {
  let out = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += ALPHABET[arr[i] % ALPHABET.length];
  return out;
}

/**
 * Uploads a data-URL hero photo to public storage and returns the public URL.
 * If `photo` is already an http(s) URL, returns it unchanged.
 */
async function uploadHeroPhotoIfNeeded(photo: string | undefined, shortId: string): Promise<string | undefined> {
  if (!photo) return undefined;
  if (!photo.startsWith("data:")) return photo;

  const match = photo.match(/^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/);
  if (!match) return undefined;
  const mime = match[1];
  const ext = mime === "image/jpeg" ? "jpg" : mime.split("/")[1];
  const b64 = match[3];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });

  const path = `${shortId}/hero.${ext}`;
  const { error } = await supabase.storage.from("card-photos").upload(path, blob, {
    contentType: mime,
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("card-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveCard(card: CardData): Promise<string> {
  // Try a few times in case of short-id collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const shortId = generateShortId();
    const heroUrl = await uploadHeroPhotoIfNeeded(card.heroPhoto, shortId);
    const payload: CardData = { ...card, heroPhoto: heroUrl };

    const { error } = await supabase.from("cards").insert({
      short_id: shortId,
      data: payload as unknown as Record<string, unknown>,
    });

    if (!error) return shortId;
    // 23505 = unique_violation → try a new id
    if (!String(error.message).toLowerCase().includes("unique")) {
      throw error;
    }
  }
  throw new Error("Could not generate a unique short id, please try again.");
}

export async function loadCard(shortId: string): Promise<CardData | null> {
  const { data, error } = await supabase
    .from("cards")
    .select("data")
    .eq("short_id", shortId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data.data as unknown as CardData;
}
