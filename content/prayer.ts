/**
 * A SEVEN-DAY PRAYER GUIDE for a medical mission team.
 *
 * The four requests it is built around are Don's own, from "Join Us in
 * Changing Lives": the safety of the team, wisdom as medical decisions are
 * made, strength and encouragement for the pastors, and that every person the
 * team meets will experience the love of Christ and respond to the Gospel.
 *
 * Scripture is KJV (public domain). The prayer points are the site's, written
 * to Don's requests and to the stages of a trip he has described — months of
 * preparation, trunks through customs, the clinic, the vision table, the
 * pastors, the Gospel conversations, and the work that continues after the
 * team goes home.
 */

export type PrayerDay = {
  day: number;
  title: string;
  focus: string;
  verse: { text: string; ref: string };
  points: string[];
  /** Drive photo id with a verified caption, for wallpapers and cards. */
  photo: string;
};

export const prayerDays: PrayerDay[] = [
  {
    day: 1,
    title: "The preparation",
    focus:
      "Months before a team leaves, hundreds of items are purchased, sorted, inventoried, labeled, translated, packed and weighed. Pray for the unseen work.",
    verse: {
      text: "Except the LORD build the house, they labour in vain that build it.",
      ref: "Psalm 127:1",
    },
    points: [
      "For the supplies to be provided in full — every Bible, every kit, every pair of glasses.",
      "For the volunteers packing trunks and writing inventory sheets, that nothing is missed.",
      "For the team's health and their families in the weeks before departure.",
    ],
    photo: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
  },
  {
    day: 2,
    title: "The journey",
    focus:
      "Trunks checked through the airline, flights, and customs officials who decide whether hundreds of pounds of supplies reach the villages. Pray for safe travel.",
    verse: {
      text: "The LORD shall preserve thy going out and thy coming in from this time forth, and even for evermore.",
      ref: "Psalm 121:8",
    },
    points: [
      "For the safety of the team on every leg of the trip.",
      "For favor with airline staff and customs officers, and for every trunk to arrive.",
      "For rest on the first night in-country before the clinic opens.",
    ],
    photo: "1B8apaW2hx5UTMxmJ2VJ8Mp3SRpevs4Sd",
  },
  {
    day: 3,
    title: "The clinic",
    focus:
      "Work begins early and often continues until the last patient has been seen. Providers evaluate, pharmacists dispense, volunteers register and assist. Pray for wisdom.",
    verse: {
      text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
      ref: "James 1:5",
    },
    points: [
      "For wisdom as medical decisions are made — Don's own request.",
      "For stamina in the heat, and patience when the line is long.",
      "For every patient to be treated with dignity, compassion and respect.",
    ],
    photo: "159_AtWRZslTni2u-2woyzNjEhxTgWH-7",
  },
  {
    day: 4,
    title: "The vision table",
    focus:
      "A sixty-cent pair of reading glasses lets someone read again, sew, study God's Word, complete paperwork, or keep earning a living. Pray for the small gifts.",
    verse: {
      text: "Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.",
      ref: "Matthew 25:40",
    },
    points: [
      "For the right pair of glasses to be on the table for each person who comes.",
      "For hygiene kits and medications to meet real needs in the homes they go to.",
      "That the person who reads clearly again would read Scripture first.",
    ],
    photo: "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej",
  },
  {
    day: 5,
    title: "The pastors",
    focus:
      "The team leaves; the village pastor stays. Many serve with little formal training and few resources. Pray for their strength and encouragement.",
    verse: {
      text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
      ref: "Galatians 6:9",
    },
    points: [
      "For strength and encouragement for the pastors who serve their communities all year — Don's own request.",
      "For the study Bibles and practical gifts to be used for years.",
      "For the friendships between the team and local churches to deepen.",
    ],
    photo: "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF",
  },
  {
    day: 6,
    title: "The Gospel",
    focus:
      "While physical needs are met, the evangelism team prays with families, gives Bibles and shares Christ. Pray, most importantly, for salvation.",
    verse: {
      text: "How beautiful are the feet of them that preach the gospel of peace, and bring glad tidings of good things!",
      ref: "Romans 10:15",
    },
    points: [
      "That every person the team meets will experience the love of Christ and respond to the truth of the Gospel — Don's most important request.",
      "For open doors in every conversation at the end of the line.",
      "For those baptized, that they would be discipled by the local church.",
    ],
    photo: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI",
  },
  {
    day: 7,
    title: "Coming home",
    focus:
      "The clinic closes and the team flies home, but the Bibles stay in the homes, the glasses keep working, and the pastors keep preaching. Pray for what continues.",
    verse: {
      text: "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.",
      ref: "Philippians 1:6",
    },
    points: [
      "For safe travel home and for the team's families.",
      "For the Bibles, glasses and kits to keep serving long after the trip ends.",
      "For the next trip — the supplies, the team, and the people who will give.",
    ],
    photo: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I",
  },
];
