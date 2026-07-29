# Connecting PayPal to the website

**Why this is needed:** PayPal takes the money and, by default, never tells the
website. That is why Ryan's $6 on July 27, 2026 showed up in PayPal and nowhere
on donandpatti.com. This connects the two so every future gift lands on the site
by itself, within about a minute.

Everything on the site side is already built and deployed. It is sitting inert
waiting for four values. **Nothing here changes how people give** — the donate
buttons already work and money already reaches Don's account. This only adds the
report back.

**Time: about 10 minutes. Needs Don present** (it is his PayPal account).

---

## Step 1 — Create a PayPal app  *(Don logs in)*

1. Go to **developer.paypal.com** → **Log in to Dashboard** → sign in with Don's
   PayPal credentials (the same account, merchant ID `EZLD2X3NN5JGL`).
2. Make sure the toggle at the top says **Live**, not Sandbox.
3. **Apps & Credentials** → **Create App**.
   - Name: `donandpatti-website`
   - Type: **Merchant**
4. You now have a **Client ID** and a **Secret** (click *Show*). Copy both.

## Step 2 — Add the webhook  *(same page)*

1. Scroll to **Webhooks** → **Add Webhook**.
2. Webhook URL — exactly this:
   ```
   https://www.donandpatti.com/api/paypal/webhook
   ```
3. Under event types, tick these three:
   - `PAYMENT.CAPTURE.COMPLETED`  ← a gift arrived
   - `PAYMENT.CAPTURE.REFUNDED`   ← a gift was refunded
   - `PAYMENT.CAPTURE.REVERSED`   ← a gift was reversed
4. Save. PayPal shows a **Webhook ID** (starts with `WH-`). Copy it.

## Step 3 — Get the Supabase service key  *(Ryan)*

Supabase dashboard → project `rxjsykcbedtyxfvyfyhl` → **Settings** → **API
Keys** → copy the **`service_role`** key.

> This one is a real secret. It bypasses every security rule in the database.
> It goes **only** into Vercel's environment variables — never into the code,
> never into a message, never into this file.

## Step 4 — Put all four into Vercel  *(Ryan)*

Vercel → project **don-patti-nichols** → **Settings** → **Environment
Variables**. Add four, all scoped to **Production**:

| Name | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | from Step 1 |
| `PAYPAL_CLIENT_SECRET` | from Step 1 |
| `PAYPAL_WEBHOOK_ID` | from Step 2 (`WH-…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | from Step 3 |

Then **Deployments** → newest → **Redeploy**. Environment variables only take
effect on a fresh deploy.

## Step 5 — Check it worked

1. Open `https://www.donandpatti.com/api/paypal/webhook` in a browser.
   It should say `"configured": true` with an empty `missing` list.
2. PayPal Developer → your webhook → **Webhook Simulator** → send a
   `PAYMENT.CAPTURE.COMPLETED`. Expect `200`.
3. Best test: **give $1 for real** from a different PayPal account. Within a
   minute it appears on `/transparency` in the total, and in the admin under
   **Money** with the donor's name.
4. Refund that $1 in PayPal. The total should drop back on its own.

---

## What happens once it's live

- Every gift writes itself into the database within seconds of clearing.
- The public sees **the total and what it went toward** — the thermometer on
  `/sponsor`, and the per-item funding bars on `/transparency` showing what is
  covered and what is still short.
- The public **never** sees a donor's name or any one person's amount. That is
  enforced in the database, not just in the page code: the `donations` table has
  no public read policy at all, and the public numbers come from
  `donation_totals()` / `donation_by_item()`, which can only return sums.
- Don and Patti see every gift in full under **Money**, with a "Say thank you"
  link straight to the donor's email.
- Refunds post as a negative row instead of deleting the original, so the
  history stays truthful and the totals self-correct.
- PayPal retries webhooks it thinks failed. A unique index on the transaction id
  means one $6 gift can never be counted twice.

## Safety notes

- The endpoint verifies **every** request against PayPal's own
  `verify-webhook-signature` API before writing anything. The URL is public, so
  an unverified payload must never be trusted — a forged gift would put a false
  number in front of Don's supporters.
- Until the four variables exist, the endpoint returns `503` and logs
  `PAYPAL_WEBHOOK_NOT_CONFIGURED`. It does **not** guess, and it does not write.
  PayPal keeps retrying, so any events sent before setup will still arrive once
  the keys are in.

## Meanwhile — recording gifts by hand

Nothing is blocked while this waits. In the admin under **Money** →
**"Write down a gift myself"**, anyone can record a gift: how much, who gave it,
what it was for. Use it for cash at church, checks in the mail, and any PayPal
gift given before this connection existed.

Ryan's $6 from July 27, 2026 has already been recorded this way, marked
`source: manual` with a note explaining it predates the webhook.
