# Printify merch shop: setup

The site is ready for a Printify shop. It needs a person with the account to do
four things. Nothing here charges anyone or creates an order.

## What is already built

- **Artwork:** eight print-ready transparent PNGs in `merch/designs/`, four
  designs in two colorways each. Regenerate or tweak them with
  `npx tsx scripts/merch-designs.tsx` (add a design name to render just one).

  | File                | Words on it                                       | Source                               |
  | ------------------- | ------------------------------------------------- | ------------------------------------ |
  | `tagline-*`         | Medical Care for the Body. Hope for the Soul.     | Don's own headline for the site      |
  | `fill-the-trunks-*` | Fill the Trunks · Bibles · Glasses · Hygiene Kits | The site's supply drive              |
  | `go-therefore-*`    | Go therefore and make disciples of all nations.   | Matthew 28:19, the site's verse      |
  | `malawi-well-*`     | Clean Water. Living Water. · Malawi Water Well    | The Malawi campaign; John 4:14 cited |

  `-dark` = white and gold ink for navy, teal, black or dark-heather shirts.
  `-light` = deep teal and darker gold for white, sand or natural shirts.

- **The site:** `/store` shows a "Shop merchandise" button, featured products
  and a proceeds line as soon as they are configured. Until then it shows the
  merch-interest list (people who join it are in the admin People tab,
  interest `mission_merchandise`, ready to be told the shop is open).

## The four steps

1. **Open the shop.** printify.com → sign up → _My Stores_ → _Add new store_
   → **Printify Pop-Up Store**. Name it something like `donandpatti`; the shop
   lives at `https://donandpatti.printify.me`. Set the payout account under
   _Settings → Payments_. Decide first **whose** account that is (Don's, or
   the ministry's). That decision also decides step 4's wording.

2. **Make the products.** _Catalog_ → pick a blank → _Start designing_ →
   upload a PNG from `merch/designs/` → center it on the front → pick shirt
   colors that match the file suffix (`-dark` on dark shirts, `-light` on light).
   Good first set: one unisex tee per design, the tagline on a hoodie, and the
   tagline on an 11 oz mug. Set the retail price in Printify; it shows you the
   base cost and your profit per item.

3. **Point the site at it.** Vercel → project `don-patti-nichols` → Settings →
   Environment Variables → add `MERCH_STOREFRONT_URL` =
   `https://donandpatti.printify.me` (Production). Redeploy. Only
   `*.printify.me`, `*.fourthwall.com` and `shop.donandpatti.com` are accepted;
   anything else is ignored on purpose.

4. **Feature products and say where the money goes.** In `content/merch.ts`:
   - add up to six `products` (name, price as the shop shows it, the product
     page URL on the same `printify.me` shop, and the mockup image URL);
   - set `proceeds` **only after Don decides it**, in words he approves, e.g.
     "Profit from every shirt goes to the Malawi water well." Leave it empty
     until then. The site never guesses this line.

Then email the merch list (admin → People → filter `mission_merchandise`).

## Rules that keep this honest

- A shirt is a **purchase, not a donation**. No tax-deductible language on
  merch, ever, even if profit is later given to Wings of Promise.
- No "only 3 left," no countdowns, no fake sale prices.
- New designs follow the site's word rule: Don's published words verbatim, or
  scripture quoted exactly or cited by reference. No invented quotes.
