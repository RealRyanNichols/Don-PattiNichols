import { photo } from "@/content/albums";

/**
 * Unchanged public archive photographs, saved from the CDN at their native
 * size or a maximum dimension of 1000px. Key by source ID so changing an
 * item's archive photo cannot silently keep showing a different local photo.
 */
const localSupplyPhotos: Record<string, string> = {
  "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi": "bible",
  "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej": "reading-glasses",
  "1fYNKv7lYMb68Lp38-2N-7-S1a_gUnDIo": "tracts",
  "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF": "pastor-gift",
  "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop": "baggage",
  "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I": "missionary",
};

export function supplyPhotoUrl(sourceId: string): string {
  const localPhoto = localSupplyPhotos[sourceId];
  return localPhoto
    ? `/images/mission-supplies/${localPhoto}.jpg`
    : photo(sourceId, 1000);
}
