import {
  GLOSSARY_CATEGORIES,
  STAT_DEFINITIONS,
} from "@/lib/stat-definitions";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "");
}

export default function GlossaryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Stat Glossary</h1>
      <p className="mt-2 text-foreground/60">
        Definitions for every stat and metric used across the app.
      </p>

      {/* Jump links */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {GLOSSARY_CATEGORIES.map((cat) => (
          <a
            key={cat.title}
            href={`#${slugify(cat.title)}`}
            className="rounded-md border border-foreground/[0.06] px-2.5 py-1 text-[12px] font-medium text-foreground/50 transition-colors hover:border-nfl-navy/30 hover:text-nfl-navy"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      {/* Category sections */}
      <div className="mt-8 space-y-10">
        {GLOSSARY_CATEGORIES.map((cat) => (
          <section key={cat.title} id={slugify(cat.title)}>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-nfl-navy">
              {cat.title}
            </h2>
            <p className="mt-1 text-[13px] text-foreground/50">
              {cat.description}
            </p>

            <div className="mt-3 overflow-x-auto rounded-md border border-foreground/[0.06]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-foreground/[0.025]">
                    <th className="whitespace-nowrap border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Stat
                    </th>
                    <th className="whitespace-nowrap border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Abbr
                    </th>
                    <th className="border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.stats.map((key) => {
                    const def = STAT_DEFINITIONS[key];
                    if (!def) return null;
                    return (
                      <tr
                        key={key}
                        className="transition-colors even:bg-foreground/[0.015] hover:bg-foreground/[0.04]"
                      >
                        <td className="whitespace-nowrap px-3 py-2 text-[13px] font-semibold text-foreground/85">
                          {def.label}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-[13px] font-medium text-nfl-navy">
                          {def.abbr}
                        </td>
                        <td className="px-3 py-2 text-[13px] leading-relaxed text-foreground/70">
                          {def.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
