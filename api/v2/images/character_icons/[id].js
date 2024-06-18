// @ts-check
import { characters } from "@gi-tcg/static-data";

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

const ICONS_MAP = Object.fromEntries(characters.map((ch) => [ch.id, ch.icon]));

/**
 * 
 * @param {VercelRequest} req 
 * @param {VercelResponse} res 
 * @returns 
 */
export default function handler(req, res) {
  const { id } = req.query;
  if (Array.isArray(id)) {
    res.status(400)
      .send("Bad request (multiple id)");
    return;
  }
  const icon = ICONS_MAP[id];
  const url = `/assets/${icon}.webp`;
  if (icon) {
    res.status(307).setHeader("Location", url).send(void 0);
    return;
  } else {
    res.status(404).send("Not found");
    return;
  }
}