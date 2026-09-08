import assert from "node:assert/strict";
import test from "node:test";
import {
  type Scratch,
  SCRATCH_KEY,
  createSaveLock,
  hasWriting,
  readScratch,
  sameWriting,
  writeScratch,
} from "../lib/adminDrafts";

function fakeStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
const draft: Scratch = {
  postId: "existing-draft",
  title: "A mission story",
  body: "The author's exact words.\n\nSecond paragraph.",
  author: "patti",
  tags: ["Belize"],
  photos: ["https://example.com/photo.jpg"],
  captions: ["The caption she wrote."],
  albumId: "album",
  linkUrl: "/give",
  linkLabel: "Support this work",
  at: 1788796800000,
};

test("a pre-upgrade phone backup recovers its existing row, words, photos and captions", () => {
  const storage = fakeStorage();
  storage.setItem("dp-admin-scratch-v1", JSON.stringify(draft));
  assert.deepEqual(readScratch(storage), draft);
});

test("a photo-only unfinished post is recoverable instead of being treated as empty", () => {
  const storage = fakeStorage();
  const photoDraft = { ...draft, title: "", body: "" };
  assert.equal(hasWriting(photoDraft), true);
  assert.equal(writeScratch(storage, photoDraft), true);
  assert.deepEqual(readScratch(storage), photoDraft);
});

test("blocked/full storage reports failure and does not erase an existing phone backup", () => {
  const storage = fakeStorage();
  writeScratch(storage, draft);
  const full = {
    ...storage,
    setItem() {
      throw new Error("Quota exceeded");
    },
  };
  assert.equal(writeScratch(full, { ...draft, body: "newer text" }), false);
  assert.deepEqual(readScratch(storage), draft);
});

test("old backups without caption arrays recover without changing the author's words", () => {
  const storage = fakeStorage();
  storage.setItem(
    SCRATCH_KEY,
    JSON.stringify({ ...draft, captions: undefined }),
  );
  assert.deepEqual(readScratch(storage)?.captions, []);
  assert.equal(readScratch(storage)?.body, draft.body);
});

test("a corrupt backup does not crash the editor or remove the original bytes", () => {
  const storage = fakeStorage();
  storage.setItem(SCRATCH_KEY, "{unfinished-json");
  assert.equal(readScratch(storage), null);
  assert.equal(storage.getItem(SCRATCH_KEY), "{unfinished-json");
});

test("saving may change the row ID but caption edits during a request remain detectable", () => {
  assert.equal(
    sameWriting(draft, { ...draft, postId: "new-row", at: draft.at + 1 }),
    true,
  );
  assert.equal(
    sameWriting(draft, { ...draft, captions: ["A newer caption"] }),
    false,
  );
  assert.equal(
    sameWriting(draft, { ...draft, body: draft.body + " Another thought." }),
    false,
  );
});

test("autosave cannot acquire the write lock while a publish request is unfinished", async () => {
  const lock = createSaveLock();
  const writes: string[] = [];
  let finish!: () => void;
  const request = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const publish = (async () => {
    assert.equal(lock.acquire(), true);
    try {
      writes.push("publish");
      await request;
    } finally {
      lock.release();
    }
  })();
  if (lock.acquire()) writes.push("autosave");
  assert.deepEqual(writes, ["publish"]);
  finish();
  await publish;
  assert.equal(lock.acquire(), true);
  lock.release();
});
