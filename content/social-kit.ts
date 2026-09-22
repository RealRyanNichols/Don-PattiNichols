/** Public outreach graphics and captions. These are ministry posts, not merchandise. */
export type SocialPost = {
  id: string;
  number: number;
  title: string;
  image: string;
  width: number;
  height: number;
  caption: string;
  destination: string;
  category: "giving" | "story";
};

export const socialPosts: SocialPost[] = [
  {
    id: "01-love-in-action",
    number: 1,
    title: "Love in action",
    image: "/images/social/01-love-in-action.png",
    width: 1254,
    height: 1254,
    caption:
      "Love in action starts with a practical need. Help Don & Patti serve through a gift toward their ministry.\n\nhttps://www.donandpatti.com/give",
    destination: "https://www.donandpatti.com/give",
    category: "giving",
  },
  {
    id: "02-bible",
    number: 2,
    title: "Help fund a Bible",
    image: "/images/social/02-bible.png",
    width: 1254,
    height: 1254,
    caption:
      "Don’s published supply budget lists a Bible at $2.50. Help fund Scripture for the mission and read more about this ministry.\n\nhttps://www.donandpatti.com/sponsor/bible",
    destination: "https://www.donandpatti.com/sponsor/bible",
    category: "giving",
  },
  {
    id: "03-hygiene-kit",
    number: 3,
    title: "Help fund a hygiene kit",
    image: "/images/social/03-hygiene-kit.png",
    width: 1254,
    height: 1254,
    caption:
      "A towel, toothbrush, toothpaste, and other practical essentials. Don’s published budget lists a hygiene kit at $3. Help fund kits for the mission.\n\nhttps://www.donandpatti.com/sponsor/hygiene-kit",
    destination: "https://www.donandpatti.com/sponsor/hygiene-kit",
    category: "giving",
  },
  {
    id: "04-reading-glasses",
    number: 4,
    title: "Help someone read again",
    image: "/images/social/04-reading-glasses.png",
    width: 1254,
    height: 1254,
    caption:
      "Reading Scripture. Threading a needle. Seeing everyday words more clearly. Support Don & Patti’s reading-glasses ministry.\n\nhttps://www.donandpatti.com/sponsor/reading-glasses",
    destination: "https://www.donandpatti.com/sponsor/reading-glasses",
    category: "giving",
  },
  {
    id: "05-ministry-trunk",
    number: 5,
    title: "Help fund a ministry trunk",
    image: "/images/social/05-ministry-trunk.png",
    width: 1254,
    height: 1254,
    caption:
      "Before supplies reach the mission field, they have to get there. Don’s published budget lists a ministry trunk at $25. Help carry the supplies.\n\nhttps://www.donandpatti.com/sponsor/trunk",
    destination: "https://www.donandpatti.com/sponsor/trunk",
    category: "giving",
  },
  {
    id: "06-carry-the-mission",
    number: 6,
    title: "Help carry the mission",
    image: "/images/social/06-carry-the-mission.png",
    width: 1254,
    height: 1254,
    caption:
      "Packing is part of the mission, too. Help with the supplies and transport that carry practical care to the people Don & Patti serve.\n\nhttps://www.donandpatti.com/sponsor",
    destination: "https://www.donandpatti.com/sponsor",
    category: "giving",
  },
  {
    id: "07-monthly-support",
    number: 7,
    title: "Small gifts. Steady support.",
    image: "/images/social/07-monthly-support.png",
    width: 1254,
    height: 1254,
    caption:
      "Steady support helps the ministry plan ahead. Choose your amount, then select “Make this a monthly donation” at PayPal if you want to give regularly.\n\nhttps://www.donandpatti.com/give",
    destination: "https://www.donandpatti.com/give",
    category: "giving",
  },
  {
    id: "08-life-and-faith",
    number: 8,
    title: "A life shared. A faith lived.",
    image: "/images/social/08-life-and-faith.png",
    width: 1254,
    height: 1254,
    caption:
      "Get to know Don & Patti Nichols: their life together, their family, their faith, and the ministry they share. Read their story.\n\nhttps://www.donandpatti.com/our-story",
    destination: "https://www.donandpatti.com/our-story",
    category: "story",
  },
  {
    id: "09-pray-give-share",
    number: 9,
    title: "Pray. Give. Share.",
    image: "/images/social/09-pray-give-share.png",
    width: 1254,
    height: 1254,
    caption:
      "There is more than one way to stand with the mission. Pray for the work, give toward a practical need, or share Don & Patti’s story with someone who would care.\n\nhttps://www.donandpatti.com/",
    destination: "https://www.donandpatti.com/",
    category: "story",
  },
  {
    id: "10-see-the-work",
    number: 10,
    title: "See the work",
    image: "/images/social/10-see-the-work.png",
    width: 1254,
    height: 1254,
    caption:
      "Read the latest mission updates from Don & Patti. Follow the stories behind the supplies, the trips, and the people they serve.\n\nhttps://www.donandpatti.com/blog",
    destination: "https://www.donandpatti.com/blog",
    category: "story",
  },
  {
    id: "11-giving-budget",
    number: 11,
    title: "Where does a gift go?",
    image: "/images/social/11-giving-budget.png",
    width: 1254,
    height: 1254,
    caption:
      "See Don’s published mission budget. Learn about the supplies, travel, and practical needs behind a trip before choosing how to help.\n\nhttps://www.donandpatti.com/what-a-mission-trip-costs",
    destination: "https://www.donandpatti.com/what-a-mission-trip-costs",
    category: "giving",
  },
  {
    id: "12-fill-the-trunks",
    number: 12,
    title: "Help fill the trunks",
    image: "/images/social/12-fill-the-trunks.png",
    width: 1254,
    height: 1254,
    caption:
      "Choose a supply. Support the mission. Explore the items in Don’s published budget and help fund a practical need. These are mission donations, not products shipped to you.\n\nhttps://www.donandpatti.com/sponsor",
    destination: "https://www.donandpatti.com/sponsor",
    category: "giving",
  },
  {
    id: "13-mission-updates",
    number: 13,
    title: "Stand with Don & Patti",
    image: "/images/social/13-mission-updates.png",
    width: 1254,
    height: 1254,
    caption:
      "Follow the stories. Share the mission. Stay connected to Don & Patti’s life and ministry, and pass an update along to someone who would like to help.\n\nhttps://www.donandpatti.com/blog",
    destination: "https://www.donandpatti.com/blog",
    category: "story",
  },
  {
    id: "14-any-gift-matters",
    number: 14,
    title: "Start with one gift",
    image: "/images/social/14-any-gift-matters.png",
    width: 1254,
    height: 1254,
    caption:
      "Start with one gift toward a practical ministry need. Choose where to help, or let Don & Patti use your gift where it is needed most.\n\nhttps://www.donandpatti.com/give",
    destination: "https://www.donandpatti.com/give",
    category: "giving",
  },
];
