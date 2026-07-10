export type AuthorKey = "don" | "patti" | "both";

export const people: Record<
  AuthorKey,
  { name: string; initials: string; href: string; role: string }
> = {
  don: {
    name: "Don Nichols",
    initials: "DN",
    href: "/don",
    role: "Preacher & Mission Team Member",
  },
  patti: {
    name: "Patti Nichols",
    initials: "PN",
    href: "/patti",
    role: "Mission Team Member",
  },
  both: {
    name: "Don & Patti Nichols",
    initials: "D&P",
    href: "/our-story",
    role: "",
  },
};
