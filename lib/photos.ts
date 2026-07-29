/**
 * PHOTO MANIFEST — real trip photos from the family's Google Drive.
 *
 * HOW THIS WORKS: the Drive folder "Don&PattiNichols/Pictures" is shared
 * "anyone with the link can view," so Google's image CDN serves these directly.
 * IMPORTANT: if that folder's sharing is turned off, these images stop loading.
 * PHASE NEXT: when the repo moves to GitHub, download originals into
 * /public/images/ and swap these URLs — then Google is out of the loop.
 *
 * EXCLUDED ON PURPOSE (privacy): IMG_1862 and the inventory-sheet close-ups
 * (IMG_1861/1864/1865/1866) — they show a home address, phone, and email.
 * Do not add them without cropping/blurring first.
 */

const drive = (id: string, w = 1600) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

export const photos = {
  /** The mission team in front of the Belize Anchor Mission church (IMG_7896) */
  teamPhoto: drive("1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I"),

  /** The Belize Anchor Mission sign with Ephesians 2:22 (IMG_7895) */
  anchorSign: drive("1FA_f5nIT6gBF49wPpTDgCxLrljxtoQ-q"),

  /** Behind-the-mission logistics shots */
  behindGallery: [
    { src: drive("1vJ7J_QSY7y1DhAmjy9dVITq2lye8iWZ9"), alt: "Ministry trunks packed and stacked, ready for the journey to Belize" },
    { src: drive("1okkwre3e9ABMhgUDl8VDGtYUrMGE0kAt"), alt: "Ministry supplies organized and staged in the village clinic" },
    { src: drive("1B8apaW2hx5UTMxmJ2VJ8Mp3SRpevs4Sd"), alt: "The flight to Belize — carrying hundreds of pounds of donated supplies" },
    { src: drive("1pBAtiNSriWluEkgBxC04n6V-BEHWDAv4"), alt: "Setting up clinic tables inside the village church" },
  ],

  /** Ministry-in-action gallery for the completed Belize trip */
  tripGallery: [
    drive("1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60"), // handing out reading glasses
    drive("1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej"), // table of reading glasses
    drive("159_AtWRZslTni2u-2woyzNjEhxTgWH-7"), // clinic room
    drive("1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI"), // sitting with families
    drive("1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx"), // Don at the table
    drive("1EsG6FWuS7IKoSEOveU1uZ8mg6D1GE2B5"), // baptism from the dock
    drive("16tL49j4iE0UCThonJjUSno9EIHHZUF3c"), // team and villagers by the water
    drive("1hIOqWtRNR7h6t-RC5DO3AkLpNUEPUpqg"), // a new Bible under the palms
    drive("1fOur4mZtWqvLpmacSmtiXB4DJJk5mAg5"), // quiet moment in the sea
  ],
};
