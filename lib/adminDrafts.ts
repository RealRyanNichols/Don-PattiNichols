/** Existing key is retained so an update cannot strand an unfinished story. */
export const SCRATCH_KEY = "dp-admin-scratch-v1";

export type Scratch = {
  postId: string | null;
  title: string;
  body: string;
  author: "don" | "patti";
  tags: string[];
  photos: string[];
  captions: string[];
  albumId: string;
  linkUrl: string;
  linkLabel: string;
  at: number;
};

export function hasWriting(s: Scratch) {
  return !!(s.title.trim() || s.body.trim() || s.photos.length);
}

export function sameWriting(a: Scratch, b: Scratch) {
  // The row ID and backup timestamp change after a save; neither is an edit.
  const { at: _atA, postId: _idA, ...writingA } = a;
  const { at: _atB, postId: _idB, ...writingB } = b;
  return JSON.stringify(writingA) === JSON.stringify(writingB);
}

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export function readScratch(storage: DraftStorage): Scratch | null {
  try {
    const raw = storage.getItem(SCRATCH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s.title !== "string" || typeof s.body !== "string")
      return null;
    const scratch: Scratch = {
      postId: typeof s.postId === "string" ? s.postId : null,
      title: s.title,
      body: s.body,
      author: s.author === "patti" ? "patti" : "don",
      tags: strings(s.tags),
      photos: strings(s.photos),
      captions: strings(s.captions),
      albumId: typeof s.albumId === "string" ? s.albumId : "",
      linkUrl: typeof s.linkUrl === "string" ? s.linkUrl : "",
      linkLabel: typeof s.linkLabel === "string" ? s.linkLabel : "",
      at: Number.isFinite(s.at) ? s.at : Date.now(),
    };
    return hasWriting(scratch) ? scratch : null;
  } catch {
    return null;
  }
}

export function writeScratch(storage: DraftStorage, scratch: Scratch): boolean {
  try {
    storage.setItem(SCRATCH_KEY, JSON.stringify(scratch));
    return true;
  } catch {
    return false;
  }
}

export function clearScratch(storage: DraftStorage) {
  try {
    storage.removeItem(SCRATCH_KEY);
  } catch {
    // A browser storage restriction must not break a successful publish.
  }
}

/** Synchronous guard: a second click or autosave cannot race a publication. */
export function createSaveLock() {
  let locked = false;
  return {
    acquire() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
  };
}
