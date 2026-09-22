# Supply photograph corrections — September 21, 2026

Browser review found the external Google image URLs failing to display. All ten
existing supply photo sources were downloaded and visually inspected. Four had
existing captions that did not match their visible contents.

## Corrected sources

| Supply                  | Previous source and visible contents                           | Replacement source                                               | New caption                                                    |
| ----------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Hygiene kit             | `1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z` — neighborhood panorama    | `1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop` — open packed luggage        | Packed luggage for a past mission trip                         |
| Ministry trunk          | `1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA` — an adult holding a child | `1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop` — open packed luggage        | Packed luggage for a past mission trip                         |
| Customs and contingency | `1Chc8cl28yNH_v0o4DAEbXb7i9tjGTMBz` — food preparation         | `1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop` — open packed luggage        | Packed luggage for a past mission trip                         |
| Sunglasses              | `1whTYhZyf5tZ--MtRq4Fkq59TwwVXlF_b` — an outdoor group         | `1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej` — reading glasses on a table | Reading glasses at a clinic table — the wider eyewear ministry |

The hygiene-kit story now describes the luggage photo as context for transporting
supplies. The Gospel-tract story describes visible literature beside reading
glasses, without the unsupported statement that it shows counting before packing.
No people, dates, places, purchases, or customs events were newly identified.
Budget amounts and other ministry claims were not changed.

## Display and sharing

- The sponsor landing-page background uses the verified luggage photograph.
- Its share card uses the larger verified reading-glasses photograph, with matching
  alternative text. Individual supply share cards use the corrected source IDs and
  source widths from `content/supplies.ts`.
- Sponsor cards, item pages, and store cards show accurate captions and image
  alternative text. Contextual luggage and eyewear photos are not described as
  photographs of hygiene kits, sunglasses, or a customs event.
- Six unique JPEGs in `public/images/mission-supplies/` serve all ten supplies,
  totaling 713,365 bytes. They are unchanged CDN renditions at native size or a
  maximum dimension of 1000px; there was no local image editing.
- The four newly downloaded, unused mismatched photographs were removed.
- All remaining photographs were visually inspected. No private documents were
  visible. Original source IDs remain available for the share-card renderer.

## Verification

Targeted ESLint, TypeScript checking, all four existing sponsor/store tests,
formatting, local-file mapping checks for all ten supplies, and `git diff --check`
passed. The file check confirmed six unique images totaling 713,365 bytes.
This change does not include a build or deployment.
