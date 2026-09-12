/**
 * Family recollections shared in August 2026, edited for reading.
 * recordedOn is the conversation date, not the date of a remembered event.
 * Narrators identify whose recollection each story represents. These are
 * editorial retellings; only the marked quotations reproduce spoken words.
 */
export type LifeStory = {
  slug: string;
  title: string;
  category: "Marriage & Family" | "Faith & Ministry" | "Family Memories";
  excerpt: string;
  narrator: "Don Nichols" | "Ryan Nichols";
  recordedOn: string;
  publishedOn: string;
  paragraphs: string[];
  quote?: string;
  subjects: ("don" | "patti")[];
};

export const lifeStories: LifeStory[] = [
  {
    slug: "the-family-they-chose-to-build",
    title: "The Family They Chose to Build",
    category: "Marriage & Family",
    excerpt:
      "Ryan remembers a turning point in Don's career, Patti speaking up, and the decision that kept their family at the center of their life.",
    narrator: "Ryan Nichols",
    recordedOn: "2026-08-29",
    publishedOn: "2026-09-12",
    subjects: ["don", "patti"],
    quote: "He chose the family over money.",
    paragraphs: [
      "When Ryan talks about the home Don and Patti built, he remembers a decision his father made during his years with Walmart. Don had worked his way up. As Ryan recalls it, the next opportunities would have meant more moves and more time away from home.",
      "Patti spoke up about what those demands would mean for their family. Ryan remembers her making clear that being together mattered. In his telling, Don listened and left the job.",
      'Years later, Ryan describes that choice plainly: "He chose the family over money." What stayed with their son was having his father there as he grew up.',
      "This is Ryan's memory of a turning point in his parents' marriage. He remembers both of them in it: Patti saying what their family needed, and Don making a decision that put those needs first.",
    ],
  },
  {
    slug: "the-faith-patti-passed-on",
    title: "The Faith Patti Passed On",
    category: "Faith & Ministry",
    excerpt:
      "Sunday mornings, youth group, and a mother's steady example: Ryan remembers the faith Patti helped pass from one generation to the next.",
    narrator: "Ryan Nichols",
    recordedOn: "2026-08-29",
    publishedOn: "2026-09-12",
    subjects: ["patti"],
    quote: "She made sure we went to church as children, every Sunday.",
    paragraphs: [
      "In Ryan's memories of childhood, church was part of the rhythm of family life. Patti made sure the children went on Sundays. He remembers Wednesday gatherings, too, and being involved in youth groups.",
      "When he talks about knowing the Lord, Ryan points to his mother. He credits her steady example with shaping his own faith and influencing Don's. It is a son's testimony to the effect her everyday choices had on the people closest to her.",
      "Ryan traces that example back another generation, to Patti's parents, Betty and Thomas Hair. He sees a line of faith running through the family: what Patti received from her parents, she carried into her own home.",
      "These memories give a glimpse of Patti's ministry as a mother. Week after week, she made church a regular part of her children's lives.",
    ],
  },
  {
    slug: "ministry-at-home",
    title: "Ministry at Home",
    category: "Marriage & Family",
    excerpt:
      "Caring for their parents, helping their community, and showing up for their children are part of the life of service Ryan remembers at home.",
    narrator: "Ryan Nichols",
    recordedOn: "2026-08-29",
    publishedOn: "2026-09-12",
    subjects: ["don", "patti"],
    quote: "They were there.",
    paragraphs: [
      "Ryan remembers watching Don and Patti care for their own parents as they grew older. He also remembers them helping people in their community, including times when the family did not have much extra to give.",
      "That care extended to Ryan and his brother, Travis. Their parents paid for the things their children needed and made a point of attending sporting events and other moments when support mattered.",
      "Work and conflicting commitments sometimes got in the way. Sometimes one parent could make it when the other could not. Looking back, Ryan remembers how consistently they tried to be present.",
      'When he describes what that meant, he comes back to a few words: "They were there." Caring for parents, helping the community, and being there for their children belong in Don and Patti\'s story alongside their mission work.',
    ],
  },
  {
    slug: "the-ordination-question-don-never-forgot",
    title: "The Ordination Question Don Never Forgot",
    category: "Faith & Ministry",
    excerpt:
      "One question from Don's ordination stayed with him: what would his priorities be in ministry? His answer began with God and his family.",
    narrator: "Don Nichols",
    recordedOn: "2026-08-26",
    publishedOn: "2026-09-12",
    subjects: ["don", "patti"],
    quote: "God first, my family second, and the church third.",
    paragraphs: [
      "Don says he remembers one question from his entire ordination council. A senior deacon wanted to know what his priorities would be in ministry.",
      'Don\'s answer was direct: "God first, my family second, and the church third."',
      "As Don remembers it, the deacon told him that a different answer would have meant a vote against his ordination. The exchange stayed with him long after the meeting itself.",
      "In telling the story, Don places his responsibility to his family within his calling. His answer gives a clear view of the priorities he brought to being a husband, a father, and a preacher.",
    ],
  },
  {
    slug: "the-night-the-fishing-boat-wouldnt-start",
    title: "The Night the Fishing Boat Wouldn't Start",
    category: "Family Memories",
    excerpt:
      "Early in his marriage to Patti, Don took his father fishing on Lake Fork. The trouble came at daylight, when it was time to head home.",
    narrator: "Don Nichols",
    recordedOn: "2026-08-25",
    publishedOn: "2026-09-12",
    subjects: ["don"],
    quote: "I turned that key and it didn't crank.",
    paragraphs: [
      "Don remembers persuading his father to go fishing with him one night on Lake Fork. It was shortly after Don and Patti had married, and he took his dad out in a boat he had bought from him.",
      "The boat had originally had two batteries. By that night, Don was down to one. They stayed out fishing, running the boat's lights through the night. When daylight came and Don was ready to go in, he turned the key. The motor would not start.",
      "His father knew the boat and asked about the cranking battery. Don had to explain that the one battery had been doing all the work.",
      "Don recalls sitting there for about three hours before another boater slowed down and came over to help. The man had jumper cables. Eventually, the motor fired up.",
      "His father's instruction was simple: keep it running until they reached the boat ramp and got the boat onto the trailer.",
      'According to Don, later invitations to go fishing in his boat met with the same answer: no. Don\'s explanation, as he finished telling the story, was just as simple: "No, he just remembered."',
    ],
  },
  {
    slug: "fishing-faith-and-the-nichols-family",
    title: "Fishing, Faith, and the Nichols Family",
    category: "Family Memories",
    excerpt:
      "Don described a fishing book that would bring family photographs, memories across generations, and Scripture into the same pages.",
    narrator: "Don Nichols",
    recordedOn: "2026-08-26",
    publishedOn: "2026-09-12",
    subjects: ["don"],
    quote: "It's about the Nichols family.",
    paragraphs: [
      "In August 2026, Don described a family fishing book he was putting together. As he talked through the photographs he wanted to include, he named pictures of himself and Ryan holding fish and spoke about gathering pictures across the generations.",
      "He wanted Travis represented, too, and wanted to include the younger generation. The purpose was to preserve something of the family for the people who would come after them.",
      "One photograph mattered even though there was no fish in it. Don said the only picture he had of his grandfather showed him preaching. That belonged in the book, too. It showed who his grandfather was.",
      "Don also described Bible verses in each chapter. In the project he was discussing, fishing memories and faith shared the same pages. This is a glimpse of that work as he described it, while he was still gathering the photographs and preparing the book.",
    ],
  },
  {
    slug: "my-dad-was-always-my-superhero",
    title: "My Dad Was Always My Superhero",
    category: "Family Memories",
    excerpt:
      "Ryan remembers Don's Marine Corps belongings, the stories he heard growing up, and the example that helped shape his own desire to serve.",
    narrator: "Ryan Nichols",
    recordedOn: "2026-08-29",
    publishedOn: "2026-09-12",
    subjects: ["don"],
    quote: "My dad was always my superhero.",
    paragraphs: [
      "When Ryan began talking about his childhood memories of Don, he started with a simple description: his dad had always been his superhero.",
      "He remembers seeing his father's Marine Corps belongings at his grandparents' home. He also remembers hearing Don talk about his service. Those things made an impression while Ryan was still young. He began to picture himself serving in the Marine Corps, too.",
      "Ryan says there was a point during college when he thought that part of his future might have passed. But he eventually went to boot camp. Looking back, he connects that path with the example he had seen in his father.",
      "This is Ryan's memory of looking up to his dad: a child's admiration that became part of his own decision to serve. Don's example remained with him as he grew into an adult.",
    ],
  },
  {
    slug: "the-conversations-behind-dons-daniel-notes",
    title: "The Conversations Behind Don's Daniel Notes",
    category: "Faith & Ministry",
    excerpt:
      "Don kept the notes from teaching the Book of Daniel. He wanted future readers to understand the classroom conversations that went with them.",
    narrator: "Don Nichols",
    recordedOn: "2026-08-26",
    publishedOn: "2026-09-12",
    subjects: ["don"],
    quote: "It was just sort of a guideline for the class.",
    paragraphs: [
      "When Ryan asked about saved sermons and teaching material, Don brought up his notes on the Book of Daniel. Before sharing them more widely, he wanted to add an introduction explaining what readers were looking at.",
      "The notes had guided a class. Don explained that there had been much more discussion as they worked through the material together. The pages did not contain everything he had said while teaching.",
      "That distinction mattered to him. He wanted readers to understand the notes in the setting where they had been used, with a teacher talking through them and a class discussing them.",
      "This brief memory offers a look at Don's teaching life and the care he takes with sharing it. The Daniel material was still being discussed as a project to prepare; this story does not reproduce the lessons themselves.",
    ],
  },
];

export function getLifeStory(slug: string): LifeStory | undefined {
  return lifeStories.find((story) => story.slug === slug);
}
