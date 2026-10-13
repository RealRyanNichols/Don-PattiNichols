const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const code = fs.readFileSync("deploy/ore-city-ministry/share.js", "utf8");
function fixture({
  share,
  clipboard,
  userAgent = "Test",
  platform = "Test",
  maxTouchPoints = 0,
} = {}) {
  const status = { textContent: "" };
  const options = { open: false, querySelector: () => ({ focus() {} }) };
  const title = { textContent: "" };
  const instructions = { textContent: "" };
  const dialog = {
    opened: false,
    showModal() {
      this.opened = true;
    },
  };
  const input = { value: "", focus() {}, select() {}, setSelectionRange() {} };
  const textLink = { href: "sms:?body=hello" };
  const card = {
    dataset: {
      video: "don-food-and-service-90s",
      title: "Food, Time & Service",
    },
    querySelector(s) {
      return s === ".share-status" ? status : options;
    },
  };
  let action = "share",
    handler;
  const button = {
    dataset: {
      get action() {
        return action;
      },
    },
    closest: () => card,
  };
  class Element {
    closest() {
      return button;
    }
  }
  const document = {
    getElementById(id) {
      return {
        "copy-dialog": dialog,
        "copy-value": input,
        "copy-dialog-title": title,
        "copy-instructions": instructions,
      }[id];
    },
    querySelectorAll(s) {
      return s === "[data-text-message]" ? [textLink] : [];
    },
    addEventListener(type, fn) {
      handler = fn;
    },
  };
  const navigator = { share, clipboard, userAgent, platform, maxTouchPoints };
  vm.runInNewContext(code, {
    document,
    navigator,
    Element,
    window: { prompt() {} },
  });
  return {
    status,
    options,
    dialog,
    input,
    title,
    instructions,
    textLink,
    async click(a) {
      action = a;
      await handler({ target: new Element() });
    },
  };
}
(async () => {
  let copied;
  let f = fixture({
    clipboard: {
      writeText: async (value) => {
        copied = value;
      },
    },
  });
  await f.click("copy-link");
  assert.equal(
    copied,
    "https://www.donandpatti.com/watch/don-food-and-service-90s",
  );
  assert.match(f.status.textContent, /Link copied/);
  await f.click("copy-embed");
  assert.match(
    copied,
    /https:\/\/www.donandpatti.com\/embed\/don-food-and-service-90s/,
  );
  assert.match(copied, /Food, Time &amp; Service/);
  assert.doesNotMatch(copied, /\.mp4/);
  let shared;
  f = fixture({
    share: async (value) => {
      shared = value;
    },
  });
  await f.click("share");
  assert.equal(
    shared.url,
    "https://www.donandpatti.com/watch/don-food-and-service-90s",
  );
  assert.equal(shared.files, undefined);
  assert.match(f.status.textContent, /Share menu opened/);
  f = fixture({
    share: async () => {
      throw Object.assign(new Error("cancel"), { name: "AbortError" });
    },
  });
  await f.click("share");
  assert.equal(f.status.textContent, "");
  assert.equal(f.options.open, false);
  f = fixture({
    share: async () => {
      throw new Error("unavailable");
    },
  });
  await f.click("share");
  assert.equal(f.options.open, true);
  assert.match(f.status.textContent, /Choose a sharing option/);
  f = fixture();
  await f.click("share");
  assert.equal(f.options.open, true);
  assert.match(f.status.textContent, /Choose Facebook/);
  f = fixture({
    clipboard: {
      writeText: async () => {
        throw new Error("denied");
      },
    },
  });
  await f.click("copy-embed");
  assert.equal(f.dialog.opened, true);
  assert.match(f.input.value, /<iframe/);
  assert.doesNotMatch(f.status.textContent, /copied/i);
  f = fixture({ userAgent: "iPhone" });
  assert.equal(f.textLink.href, "sms:&body=hello");
  f = fixture({ userAgent: "Android" });
  assert.equal(f.textLink.href, "sms:?body=hello");
  console.log(
    "Share actions: copy link, embed escaping, native share link only, cancel, rejected/unsupported native share, clipboard fallback, iPhone/Android text URLs passed.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
