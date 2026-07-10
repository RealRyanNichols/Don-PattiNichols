/**
 * Photo sources.
 *
 * Currently served from the publicly-shared Google Drive folder
 * "Don&PattiNichols/Pictures" (folder id 1FpUEca_PSQmEzjzQMDpAdEI2C79dPgaA)
 * via the lh3.googleusercontent.com proxy. If that folder's sharing is ever
 * turned off, these images go dark — the plan of record is to self-host
 * everything under public/images/ and point these entries at local paths.
 *
 * PRIVACY — never publish these Drive files without cropping/blurring:
 * IMG_1861 (1y1gqtotQ1O2eFqRZlMUzZKl0G1iXFamu), IMG_1862 (1IwEsAn_R-0OpYS0NlohZv052qA3843AA),
 * IMG_1864 (1WQe1VMQrWniGhZrIvODTPHmTtqWlsf-W), IMG_1865 (1W0h2NXTWbCihisS2ZLG_nqzd2Y0C8gCJ),
 * IMG_1866 (1r0gynRc7tGKtfeFOK1J1jhfbNr9OCQ1Q) — trunk labels show Don's home
 * address, phone number, and personal email.
 */

export function drivePhoto(fileId: string, width = 1600) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}

export const photos = {
  /** IMG_7896 — the mission team gathered in front of the Belize Anchor Mission church. */
  team: drivePhoto("1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I"),
  /** IMG_7895 — the Belize Anchor Mission sign, painted with Ephesians 2:22. */
  anchorSign: drivePhoto("1FA_f5nIT6gBF49wPpTDgCxLrljxtoQ-q"),
};

/** Belize June 2026 trip gallery — scenes from the field, in display order. */
export const belize2026Gallery = [
  "1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60", // IMG_1905
  "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej", // IMG_1906
  "159_AtWRZslTni2u-2woyzNjEhxTgWH-7", // IMG_1904
  "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI", // IMG_1910
  "1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx", // IMG_1914
  "1EsG6FWuS7IKoSEOveU1uZ8mg6D1GE2B5", // IMG_7772
  "16tL49j4iE0UCThonJjUSno9EIHHZUF3c", // IMG_7584
  "1hIOqWtRNR7h6t-RC5DO3AkLpNUEPUpqg", // IMG_7623
  "1fOur4mZtWqvLpmacSmtiXB4DJJk5mAg5", // IMG_9390
].map((id) => drivePhoto(id));
