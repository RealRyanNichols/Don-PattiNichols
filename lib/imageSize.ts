/**
 * Read a photograph's real width and height without downloading all of it.
 *
 * The share card needs to know the SHAPE of what Don uploaded before it can
 * lay itself out. A wide landscape shot of a village wants to be the whole
 * card; a near-square portrait of him and Patti wants to sit in a panel with
 * the title beside it. Forcing both into the same square crops faces and
 * wastes the photograph.
 *
 * Both JPEG and PNG carry their dimensions in the first few kilobytes, so a
 * Range request is enough. If anything at all goes wrong — an odd format, a
 * server that ignores Range, a timeout — this returns null and the card falls
 * back to its safe layout. Never let a thumbnail take down a page.
 */
export type Dim = { width: number; height: number; ratio: number };

export async function imageSize(url: string): Promise<Dim | null> {
  try {
    const res = await fetch(url, { headers: { Range: "bytes=0-65535" } });
    if (!res.ok && res.status !== 206) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    const dim = parsePng(buf) ?? parseJpeg(buf);
    if (!dim || !dim.width || !dim.height) return null;
    return { ...dim, ratio: dim.width / dim.height };
  } catch {
    return null;
  }
}

function parsePng(b: Uint8Array): { width: number; height: number } | null {
  // 89 50 4E 47 0D 0A 1A 0A, then IHDR at byte 16.
  if (b.length < 24) return null;
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!sig.every((v, i) => b[i] === v)) return null;
  const dv = new DataView(b.buffer, b.byteOffset);
  return { width: dv.getUint32(16), height: dv.getUint32(20) };
}

function parseJpeg(b: Uint8Array): { width: number; height: number } | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  const dv = new DataView(b.buffer, b.byteOffset);
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = b[i + 1];
    // Start Of Frame markers carry the dimensions. C4/C8/CC are not frames.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return { height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
    }
    const len = dv.getUint16(i + 2);
    if (len <= 0) return null;
    i += 2 + len;
  }
  return null;
}
