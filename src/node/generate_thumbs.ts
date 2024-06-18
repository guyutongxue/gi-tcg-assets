import path from "node:path";
import { mkdir, readdir } from "node:fs/promises";
import Sharp from "sharp";
import { imageDir, thumbImageDir } from "./config";
import { existsSync } from "node:fs";

if (!existsSync(thumbImageDir)) {
  await mkdir(thumbImageDir, { recursive: true });
}

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
  } else if (filename.startsWith("UI_Gcg_Char")) {
    image.resize(30, null);
  } else {
    image.resize(null, 20);
  }
  await image.toFile(path.join(thumbImageDir, filename));
  console.log(`Generated thumb for ${filename}`);
}
