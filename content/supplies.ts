/**
 * THE SUPPLY DRIVE — every item and price comes from Don's published budget.
 * Do not change costs without his confirmation.
 *
 * `funded` = units sponsored so far. Update by hand as gifts come in
 * (PayPal-webhook automation comes later). Starting at 0 is honest:
 * the page says "Be the first."
 */

export type SupplyItem = {
  id: string;
  name: string;
  unitCost: number;
  /** How many are needed for the trip. null = open-ended (e.g. missionaries). */
  needed: number | null;
  funded: number;
  blurb: string;
  icon: "bible" | "kit" | "glasses" | "sun" | "trunk" | "plane" | "gift" | "tract" | "shield" | "person";
  /** Default quantity the stepper starts at. */
  startQty: number;
  /** Drive photo id from Don & Patti's own archive — the product photograph. */
  photo: string;
  /** Where the photograph was taken, shown as the caption. */
  photoFrom: string;
  /**
   * True pixel width of the source file, measured from the CDN.
   * Many archive photos are compressed iCloud exports (300-480px). Anything
   * under 600 is too small for a large social share card, so `lib/og.ts`
   * substitutes the designed Fill the Trunks artwork for those items.
   * Re-measure if a photo is swapped.
   */
  photoPx: number;
  /** The longer story told on this item's own page. */
  story: string[];
};

export const supplyDrive = {
  title: "Fill the Trunks",
  tagline:
    "Every trunk that flies to Belize is packed with things people gave. Pick what your gift becomes.",
  /** Don's published trip goal: ~$2,215 supplies + ~$1,725 logistics */
  goalUsd: 3940,

  items: [
    {
      id: "bible",
      name: "A Bible",
      unitCost: 2.5,
      needed: 250,
      funded: 0,
      blurb: "Placed into the hands of someone eager to read God's Word.",
      icon: "bible",
      startQty: 4,
      photo: "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi",
      photoFrom: "From the Bible Ministry — Malawi",
      photoPx: 300,
      story: [
        "Two dollars and fifty cents is what it costs to put a Bible in someone's hands \u2014 a real one, in a language they read, that stays in the village long after the team flies home.",
        "Don and Patti have been distributing Scripture on the mission field since 2013. The photograph is from their own Bible ministry: Bibles bought in-country, hauled by truck, and given away one at a time.",
      ],
    },
    {
      id: "hygiene-kit",
      name: "A Hygiene Kit",
      unitCost: 3,
      needed: 300,
      funded: 0,
      blurb: "Towel, sewing kit, toothbrush, toothpaste, lip balm, and a Gospel booklet.",
      icon: "kit",
      startQty: 3,
      photo: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
      photoFrom: "Kits packed for the Dominican Republic",
      photoPx: 1600,
      story: [
        "A towel, a sewing kit, a toothbrush and toothpaste, lip balm, and a Gospel booklet \u2014 packed into a bag a family can actually use, and handed over with dignity.",
        "The photograph shows kits from a past trip, packed and sealed on Don and Patti's own table before they ever left the country.",
      ],
    },
    {
      id: "reading-glasses",
      name: "Reading Glasses",
      unitCost: 0.6,
      needed: 300,
      funded: 0,
      blurb: "One pair can mean reading Scripture, sewing, working, and seeing family clearly.",
      icon: "glasses",
      startQty: 10,
      photo: "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej",
      photoFrom: "The glasses table — Belize, June 2026",
      photoPx: 1600,
      story: [
        "Sixty cents. That is the price of someone reading Scripture for themselves, threading a needle, reading a medicine label, or seeing a grandchild's face clearly.",
        "This photograph is the actual glasses table from the June 2026 Belize clinic \u2014 rows of reading glasses laid out and fitted one face at a time, free to every patient.",
      ],
    },
    {
      id: "sunglasses",
      name: "Sunglasses",
      unitCost: 1,
      needed: 150,
      funded: 0,
      blurb: "Protection for eyes that work all day under the Caribbean sun.",
      icon: "sun",
      startQty: 10,
      photo: "1whTYhZyf5tZ--MtRq4Fkq59TwwVXlF_b",
      photoFrom: "Priced and bagged for the field",
      photoPx: 478,
      story: [
        "For people who work outdoors all day near the equator, sunglasses are not a fashion item \u2014 they are eye protection most families never buy for themselves.",
        "One dollar covers a pair, bagged and ready for the clinic table.",
      ],
    },
    {
      id: "tracts",
      name: "Gospel Tracts (bundle)",
      unitCost: 60,
      needed: 1,
      funded: 0,
      blurb: "The full supply of Gospel literature for the whole trip.",
      icon: "tract",
      startQty: 1,
      photo: "1fYNKv7lYMb68Lp38-2N-7-S1a_gUnDIo",
      photoFrom: "Gospel literature stacked for a trip",
      photoPx: 480,
      story: [
        "Sixty dollars supplies the Gospel literature for an entire trip \u2014 the tracts and booklets that go home in pockets after the clinic closes.",
        "The photograph shows the real thing: literature stacked and counted before packing.",
      ],
    },
    {
      id: "pastor-gift",
      name: "Pastor & Wife Gift Set",
      unitCost: 100,
      needed: 3,
      funded: 0,
      blurb: "A study Bible and practical household gifts for a village pastor and his wife.",
      icon: "gift",
      startQty: 1,
      photo: "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF",
      photoFrom: "Don with a pastor on the field",
      photoPx: 478,
      story: [
        "The team leaves. The village pastor stays. This gift \u2014 a quality study Bible and practical household gifts for him and his wife \u2014 is how the mission keeps preaching after the trunks are empty.",
        "Don has partnered with the same village pastors for years; the photograph is him with one of them, on the field.",
      ],
    },
    {
      id: "trunk",
      name: "A Ministry Trunk",
      unitCost: 25,
      needed: 8,
      funded: 0,
      blurb: "The heavy-duty trunk itself — it will carry fifty pounds of supplies to Belize.",
      icon: "trunk",
      startQty: 1,
      photo: "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA",
      photoFrom: "Trunks on the move — Dominican Republic",
      photoPx: 1600,
      story: [
        "Everything the mission gives away travels in heavy-duty trunks \u2014 fifty pounds each of Bibles, medicine, glasses, and kits, packed to a written inventory and wheeled through customs.",
        "Twenty-five dollars buys one trunk. It will make more than one trip.",
      ],
    },
    {
      id: "baggage",
      name: "Fly a Trunk to Belize",
      unitCost: 200,
      needed: 6,
      funded: 0,
      blurb: "The airline baggage fee that gets one packed trunk onto the plane.",
      icon: "plane",
      startQty: 1,
      photo: "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop",
      photoFrom: "Packed trunks headed for the field",
      photoPx: 478,
      story: [
        "A packed trunk is worthless in a garage in Texas. Two hundred dollars is the airline baggage fee that puts one fifty-pound trunk on the plane and gets it to the field.",
        "This is consistently the least-glamorous, most-needed gift on the list.",
      ],
    },
    {
      id: "customs",
      name: "Customs & Contingency Share",
      unitCost: 25,
      needed: 13,
      funded: 0,
      blurb: "Customs fees and the emergency fund that keeps the mission moving.",
      icon: "shield",
      startQty: 1,
      photo: "1Chc8cl28yNH_v0o4DAEbXb7i9tjGTMBz",
      photoFrom: "Supplies staged for the clinic",
      photoPx: 360,
      story: [
        "Customs fees, border paperwork, and the contingency fund that keeps a trip moving when something goes sideways \u2014 somebody has to cover the unexciting parts, and they matter as much as the Bibles.",
        "Twenty-five dollars covers one share of it.",
      ],
    },
    {
      id: "missionary",
      name: "Sponsor a Missionary",
      unitCost: 1200,
      needed: null,
      funded: 0,
      blurb: "Airfare, lodging, meals, and ground transport for one unpaid volunteer to serve.",
      icon: "person",
      startQty: 1,
      photo: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I",
      photoFrom: "The team in Belize",
      photoPx: 1032,
      story: [
        "Every person on this team is an unpaid volunteer who takes vacation time to serve. Twelve hundred dollars covers one of them completely: airfare, lodging, meals, and ground transport.",
        "Eight hundred of it is the flight; four hundred covers room and board for the week. None of it is salary \u2014 nobody on this team is paid.",
      ],
    },
  ] satisfies SupplyItem[],
};
