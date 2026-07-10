"use client";

const guides = [
  {
    title: "How do I see who wrote to us?",
    steps: [
      "Tap the Messages tab at the top.",
      "New messages have a gold edge and a \"New\" tag.",
      "Read the message. To answer, tap \"Reply by Email\" — it opens your regular email with their address already filled in.",
      "When you're done with a message, tap \"Mark as Handled\" so it moves out of your New list.",
    ],
  },
  {
    title: "How do I post an update to the website?",
    steps: [
      "Tap the Updates tab, then the gold \"Write a New Update\" button.",
      "Step 1: tap who is writing — Don, Patti, or Both of us.",
      "Step 2: tap what it's about.",
      "Step 3: type a title.",
      "Step 4: type your update, just like telling a story to a friend. Press Enter twice to start a new paragraph.",
      "Step 5: look at the preview to see how it will appear.",
      "Tap the gold \"Publish to the Website\" button. That's it — it shows up on the website's Timeline within a few minutes.",
      "Not ready to share it yet? Tap \"Save for Later\" instead, and Publish it another day from the list.",
    ],
  },
  {
    title: "How do I see our followers?",
    steps: [
      "Tap the Followers tab.",
      "Everyone who signed up for email updates on the website is listed there, newest first.",
    ],
  },
  {
    title: "How do I see donations?",
    steps: [
      "Tap the Donations tab.",
      "Online gifts will appear there automatically once PayPal giving is connected.",
      "Checks and cash handed to you directly won't appear — only online gifts.",
    ],
  },
  {
    title: "Something looks wrong. What do I do?",
    steps: [
      "First, refresh the page (the circular arrow near the top of your browser).",
      "If it still looks wrong, sign out, sign back in, and try again.",
      "Still stuck? Call or text Ryan — nothing you tap in here can break the website.",
    ],
  },
];

export default function HelpTab() {
  return (
    <div>
      <h2 className="h-display text-2xl">Help</h2>
      <p className="mt-2 text-lg text-ink/70">
        Everything here, step by step. Take your time — you can't break anything by looking.
      </p>

      <div className="mt-6 space-y-5">
        {guides.map((guide) => (
          <div key={guide.title} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">{guide.title}</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-ink/80">
              {guide.steps.map((step) => (
                <li key={step.slice(0, 40)}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-sand-dark p-6">
        <h3 className="font-serif text-xl font-bold">For Ryan — one-time setup</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-ink/75">
          <li>
            Supabase Dashboard → Authentication → Users → "Add user" → "Create new user": enter
            each person's email and a password, and check "Auto Confirm User". Do this for Don and
            Patti (your own login too, if you haven't).
          </li>
          <li>Add their emails on the Team tab here (your email is already on it).</li>
          <li>
            Write their email + password on a card for them, and bookmark this page
            (/admin) on their devices.
          </li>
        </ol>
      </div>
    </div>
  );
}
