import { StatTooltip } from "@/components/StatTooltip";
import { getStatDescription } from "@/lib/stat-definitions";

interface StatSectionProps {
  title: string;
  stats: { label: string; value: string; key?: string }[];
}

export function StatSection({ title, stats }: StatSectionProps) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-nfl-navy">
        {title}
      </h3>

      <div className="overflow-x-auto rounded-md border border-foreground/6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-foreground/2.5">
              {stats.map((stat) => (
                <th
                  key={stat.label}
                  className="whitespace-nowrap border-b border-foreground/6 px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35"
                >
                  <StatTooltip
                    content={stat.key ? getStatDescription(stat.key) : undefined}
                    position="top"
                  >
                    {stat.label}
                  </StatTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {stats.map((stat) => (
                <td
                  key={stat.label}
                  className="whitespace-nowrap px-3 py-2 font-mono text-[14px] font-semibold leading-none tracking-tight text-foreground/85"
                >
                  {stat.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
