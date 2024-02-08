import data from "../common/data.js";
import { outputDir } from "./config";
import path from "node:path";

Bun.write(
  path.join(outputDir, "./statusData.json"),
  JSON.stringify(
    data.ChineseSimplified.filter((item) => item.TYPE === "tcgstatuseffects" && item.cardtype !== "GCG_CARD_MODIFY"),
    void 0,
    2,
  ),
);
