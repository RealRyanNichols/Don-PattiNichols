# Site fonts

`app/layout.tsx` uses local WOFF2 copies of the exact Latin fonts already served
by DonAndPatti.com. They were copied without modification from the production
release `ed28d89b0bc2054ea0ce45055f577a6ae8b6ee88` on October 13, 2026.
This removes the need to contact Google Fonts during development or builds.

| Local file | Production media filename | Verified font |
| --- | --- | --- |
| `Lora-latin-normal.woff2` | `8c2eb9ceedecfc8e.p.23aeddxv5enbo.woff2` | Lora Regular, variable weight 400–700 |
| `Lora-latin-italic.woff2` | `5e5dfa9e86f764b8.p.22x-ws2e_cdqh.woff2` | Lora Italic, variable weight 400–700 |
| `Inter-latin-normal.woff2` | `83afe278b6a6bb3c.p.2bn3s6zvc0dyp.woff2` | Inter Regular, variable weight 100–900; site uses 400–700 |

The production stylesheet identified all three files as its Latin subset.
Font metadata was checked with Next.js's bundled font parser. The normal and
italic styles, configured 400–700 weights, CSS variables, fallback lists and
`font-display: swap` are preserved. Next.js computes fallback font metrics from
these local font files.

SHA-256:

- Lora normal: `6b102ab35aa1f2b315788bb4853434ed1e52137603bf7a3da71a682276748d45`
- Lora italic: `3d536d49566e82a7905c8b0096758005f6616029ac08528d1f4789c1100dff6a`
- Inter normal: `c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4`

Both families are distributed under the SIL Open Font License 1.1. The license
files were obtained from the official Google Fonts repository:

- <https://github.com/google/fonts/blob/main/ofl/lora/OFL.txt>
- <https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt>

The embedded font copyright notices identify The Lora Project Authors (2011)
and The Inter Project Authors (2016), respectively. The current upstream Inter
license notice identifies The Inter Project Authors (2020).

`Lora-Bold.ttf` predates this change and remains in use for generated share
images. It was not changed.
