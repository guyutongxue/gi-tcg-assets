// @ts-check
/// <reference types="@genshin-db/tcg" />
import rawData from "@genshin-db/tcg/src/min/data.min.json" with { type: "json" };

/**
 *
 * @typedef {import("@genshin-db/tcg").Language} Language
 *
 * @typedef {{
 *  id: number;
 *  [key: string]: unknown;
 * }} AnyData
 *
 * @typedef {"tcgcharactercards" | "tcgactioncards" | "tcgsummons" | "tcgstatuseffects" | "tcgkeywords" | "tcgskills"} TypeKey
 *
 * @typedef {{
 *   data: {
 *     [lang in Language]: Record<TypeKey, Record<string, AnyData>>
 *   },
 *   image: Record<TypeKey, Record<string, unknown> | undefined>;
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
  "tcgkeywords",
];

/** @type {Record<Language, TransformedData[]>} */
// @ts-expect-error
const transformedData = Object.fromEntries(
  Object.entries(data).map(([lang, langData]) => ([
    lang,
    keys.flatMap((key) =>
      Object.entries(langData[key]).flatMap(([name, obj]) => {
        const thisObj = {
          ...obj,
          TYPE: key,
          image: image?.[key]?.[name] ?? null
        };
        if (key === "tcgcharactercards" && "skills" in obj && Array.isArray(obj.skills)) {
          return [
            thisObj,
            ...obj.skills.map((skill) => ({
              ...skill,
              TYPE: "tcgskills",
              image: image?.tcgskills?.[skill.name] ?? null
            })),
          ];
        } else {
          return [thisObj];
        }
      }),
    ),
  ])),
);

export default transformedData;
