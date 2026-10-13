import assert from "node:assert/strict";
import test from "node:test";
import {
  copyVideoShareText,
  isShareCancelled,
  videoShareLinks,
  videoTextMessageUrl,
} from "../lib/videoSharing";

const id = "don-food-and-service-90s";
const title = "Food, Time & Service";

test("sharing uses the specific watch page, not the homepage or a media file", () => {
  const links = videoShareLinks(id, title);
  assert.equal(
    links.watchUrl,
    "https://www.donandpatti.com/watch/don-food-and-service-90s",
  );
  assert.equal(new URL(links.facebook).searchParams.get("u"), links.watchUrl);
  const x = new URL(links.x);
  assert.equal(x.searchParams.get("url"), links.watchUrl);
  assert.equal(
    x.searchParams.get("text"),
    "Watch Food, Time & Service from Don & Patti Nichols.",
  );
  assert.doesNotMatch(JSON.stringify(links), /\.mp4|download|upload|youtube/i);
});

test("invalid IDs cannot escape the fixed first-party watch and embed routes", () => {
  for (const invalid of [
    "",
    "../admin",
    "https://evil.example",
    "a?x=1",
    "a#b",
    "a/b",
    "a%2fb",
    'a"',
    "a\nb",
    "a--b",
    "A",
    "a".repeat(121),
  ]) {
    assert.throws(() => videoShareLinks(invalid, title), /Invalid video ID/);
  }
});

test("embed code keeps titles as text and preserves the portrait player", () => {
  const { embedCode } = videoShareLinks(
    id,
    '<video title="x" onload="bad"> & \'story\'',
  );
  assert.match(
    embedCode,
    /src="https:\/\/www\.donandpatti\.com\/embed\/don-food-and-service-90s"/,
  );
  assert.match(
    embedCode,
    /title="&lt;video title=&quot;x&quot; onload=&quot;bad&quot;&gt; &amp; &#39;story&#39;"/,
  );
  assert.match(embedCode, /aspect-ratio:9\/16/);
  assert.match(embedCode, /allowfullscreen loading="lazy"/);
  assert.doesNotMatch(embedCode, /<video| onload="/);
});

test("text message links encode the complete message for Apple and other phones", () => {
  for (const apple of [false, true]) {
    const sms = videoTextMessageUrl(id, title, apple);
    assert.ok(sms.startsWith(apple ? "sms:&body=" : "sms:?body="));
    assert.equal(
      decodeURIComponent(sms.split("body=")[1]),
      "Watch Food, Time & Service from Don & Patti Nichols. https://www.donandpatti.com/watch/don-food-and-service-90s",
    );
  }
});

test("copy feedback only succeeds after the clipboard finishes", async () => {
  let finish!: () => void;
  let copied = false;
  const pending = copyVideoShareText("video link", async (text) => {
    assert.equal(text, "video link");
    await new Promise<void>((resolve) => {
      finish = resolve;
    });
  }).then((success) => {
    copied = success;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(copied, false);
  finish();
  await pending;
  assert.equal(copied, true);
});

test("missing or rejected clipboard access requests manual copying", async () => {
  assert.equal(await copyVideoShareText("link"), false);
  assert.equal(
    await copyVideoShareText("link", async () => {
      throw new Error("denied");
    }),
    false,
  );
});

test("canceling the share sheet is a normal dismissal, not a sharing failure", () => {
  assert.equal(isShareCancelled({ name: "AbortError" }), true);
  assert.equal(
    isShareCancelled(new DOMException("dismissed", "AbortError")),
    true,
  );
  for (const error of [
    null,
    "AbortError",
    { name: "NotAllowedError" },
    new Error("failed"),
  ]) {
    assert.equal(isShareCancelled(error), false);
  }
});
