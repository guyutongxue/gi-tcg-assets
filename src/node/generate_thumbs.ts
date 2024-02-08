import path from "node:path";
import { readdir } from "node:fs/promises";
import Sharp from "sharp";
import { imageDir, thumbImageDir } from "./config";

const filenames = await readdir(imageDir);
for (const filename of filenames) {
  if (!filename.endsWith(".webp")) {
    continue;
  }
  const image = Sharp(path.join(imageDir, filename));
  const { width, height } = await image.metadata();
  if (filename.startsWith("Skill") || filename.startsWith("MonsterSkill")) {
    if (width! > height!) {
      image.resize(30, null);
    } else {
      image.resize(null, 30);
    }
  } else if (filename.startsWith("UI_Gcg_CardFace")) {
    image.resize(80, null);
  } else {
    image.resize(null, 20);
  }
  const thumb = image.resize(100, 100);
  await thumb.toFile(path.join(thumbImageDir, filename));
  console.log(`Generated thumb for ${filename}`);
}
