(() => {
  "use strict";

  const origin = "https://www.donandpatti.com";
  const dialog = document.getElementById("copy-dialog");
  const copyValue = document.getElementById("copy-value");
  const dialogTitle = document.getElementById("copy-dialog-title");
  const copyInstructions = document.getElementById("copy-instructions");
  const isAppleMobile =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const setStatus = (card, message) => {
    card.querySelector(".share-status").textContent = message;
  };

  const showManualCopy = (value, isEmbed) => {
    copyValue.value = value;
    dialogTitle.textContent = isEmbed
      ? "Embed this video on your website"
      : "Copy this video link";
    copyInstructions.textContent = isEmbed
      ? "Copy this code and paste it into an HTML or embed block on your website."
      : "Select the link below, then choose Copy to send it to someone.";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      copyValue.focus();
      copyValue.select();
      copyValue.setSelectionRange(0, copyValue.value.length);
    } else {
      // The prompt keeps the link usable on older browsers without dialog support.
      window.prompt(
        isEmbed ? "Copy this embed code:" : "Copy this video link:",
        value,
      );
    }
  };

  const copy = async (card, value, isEmbed = false) => {
    try {
      if (
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== "function"
      ) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(value);
      setStatus(
        card,
        isEmbed
          ? "Embed code copied. Paste it into your website’s embed block."
          : "Link copied. Send it to someone who would enjoy this story.",
      );
    } catch {
      showManualCopy(value, isEmbed);
      setStatus(card, "Select and copy the text in the open window.");
    }
  };

  const revealShareOptions = (card) => {
    const options = card.querySelector(".share-options");
    options.open = true;
    const firstLink = options.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  };

  document.querySelectorAll("[data-text-message]").forEach((link) => {
    if (isAppleMobile)
      link.href = link.href.replace("sms:?body=", "sms:&body=");
  });

  // Starting another story pauses the previous one, so sounds never overlap.
  document.querySelectorAll("video").forEach((video) => {
    video.addEventListener("play", () => {
      document.querySelectorAll("video").forEach((other) => {
        if (other !== video) other.pause();
      });
    });
    video.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  document.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const card = button.closest("[data-video]");
    if (!card) return;
    const slug = card.dataset.video;
    const title = card.dataset.title;
    const url = `${origin}/watch/${slug}`;
    const shareData = {
      title: `${title} | Don & Patti Nichols`,
      text: `${title} — a ministry story from Don & Patti Nichols.`,
      url,
    };
    setStatus(card, "");

    if (button.dataset.action === "copy-link") {
      await copy(card, url);
    } else if (button.dataset.action === "copy-embed") {
      const safeTitle = title.replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character],
      );
      const code = `<iframe src="${origin}/embed/${slug}" title="${safeTitle} — Don &amp; Patti Nichols" width="360" height="640" style="width:100%;max-width:420px;aspect-ratio:9/16;height:auto;border:0;" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      await copy(card, code, true);
    } else if (button.dataset.action === "share") {
      if (typeof navigator.share !== "function") {
        revealShareOptions(card);
        setStatus(card, "Choose Facebook, X, text message, or copy the link.");
        return;
      }
      try {
        await navigator.share(shareData);
        setStatus(card, "Share menu opened.");
      } catch (error) {
        if (error && error.name === "AbortError") return;
        revealShareOptions(card);
        setStatus(card, "Choose a sharing option below, or copy the link.");
      }
    }
  });
})();
