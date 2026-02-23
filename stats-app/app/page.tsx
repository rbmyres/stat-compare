import Link from "next/link";

const sections = [
  {
    href: "/players",
    title: "Player Stats",
    description: "Search and explore individual player statistics across seasons.",
  },
  {
    href: "/teams",
    title: "Team Stats",
    description: "View team-level offensive and defensive statistics.",
  },
  {
    href: "/compare",
    title: "Compare",
    description: "Compare players or teams side by side.",
  },
  {
    href: "/graph",
    title: "Graph",
    description: "Visualize trends and performance over time.",
  },
  {
    href: "/dictionary",
    title: "Dictionary",
    description: "Definitions for every stat and metric.",
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="pt-8">
        <h1 className="text-3xl font-bold tracking-tight">StatCompare</h1>
        <p className="mt-2 text-foreground/60">
          Explore, compare, and analyze NFL player and team statistics.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-lg border border-foreground/10 p-5 transition-colors hover:border-foreground/20 hover:bg-foreground/2"
          >
            <h2 className="font-semibold group-hover:text-nfl-navy">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-foreground/50">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
