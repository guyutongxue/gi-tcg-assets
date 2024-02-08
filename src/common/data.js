import rawData from "@genshin-db/tcg/src/min/data.min.json" with { type: "json" };

/**
 *
 * @typedef {import("genshin-db").Language} Language
 *
 * @typedef {{
 *  id: number;
 *  [key: string]: unknown;
 * }} AnyData
 *
 * @typedef {"tcgcharactercards" | "tcgactioncards" | "tcgsummons" | "tcgstatuseffects"} TypeKey
 *
 * @typedef {{
 *   data: {
 *     [lang in Language]: Record<TypeKey, Record<string, AnyData>;
 *   },
 *   image: Record<Omit<TypeKey, "tcgstatuseffects">, object>;
 * }} RawData
 *
 * @typedef {AnyData & {
 *  TYPE: TypeKey;
 *  image: any;
 * }} TransformedData
 */

const { data, image } = /** @type {RawData} */ (rawData);

/** @type {TypeKey[]} */
const keys = [
  "tcgcharactercards",
  "tcgactioncards",
  "tcgsummons",
  "tcgstatuseffects",
];

/** @type {Record<Language, TransformedData[]>} */
const transformedData = Object.fromEntries(
  Object.entries(data).map(([lang, langData]) => [
    lang,
    keys.flatMap((key) =>
      Object.entries(langData[key]).map(([name, obj]) => ({
        ...obj,
        TYPE: key,
        image: image?.[key]?.[name] ?? null
      })),
    ),
  ]),
);

export default transformedData;
