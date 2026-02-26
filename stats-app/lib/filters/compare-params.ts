import { parseAsStringLiteral, createParser } from "nuqs";

export const COMPARE_MODES = ["player", "team"] as const;
export type CompareMode = (typeof COMPARE_MODES)[number];

/** Parses a comma-separated string into a string array and vice versa. */
export const parseAsCommaList = createParser<string[]>({
  parse: (value) => (value ? value.split(",").filter(Boolean) : []),
  serialize: (value) => value.join(","),
}).withDefault([]);

export const compareParsers = {
  mode: parseAsStringLiteral(COMPARE_MODES).withDefault(
    "player" as CompareMode
  ),
  ids: parseAsCommaList,
  stats: parseAsCommaList,
};
