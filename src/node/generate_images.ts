import Sharp from "sharp";
import { parseArgs } from "node:util";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { existsSync, statSync } from "node:fs";
import allData from "../common/data";
import skillImageNames from "../output/skillImageNames.json";
import statusImageNames from "../output/statusImageNames.json";
import { imageDir, outputDir } from "./config";

const { English: data } = allData;

const {
  positionals: [input],
} = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
});

if (typeof input === "undefined") {
  console.error("Input path not specified");
  process.exit(1);
}

// 将原始提取素材的图片分组，找到每组中的最大文件（最高分辨率）路径

const allImagePaths: Record<string, string> = {};

const filenames = await readdir(input);
const grouped: Record<string, string[]> = {};
const regex = /^(.+?)(?:#\d+)?\.png$/;
for (const filename of filenames) {
  const match = filename.match(regex);
  if (match) {
    const name = match[1];
    const group = grouped[name];
    if (group) {
      group.push(filename);
    } else {
      grouped[name] = [filename];
    }
  }
}
for (const name in grouped) {
  const group = grouped[name];
  const maxFile = group.reduce(
    (max, file) => {
      const filePath = path.join(input, file);
      const fileSize = statSync(filePath).size;
      return fileSize > max.size ? { file, size: fileSize } : max;
    },
    { file: "", size: 0 },
  );

  const maxFilePath = path.join(input, maxFile.file);
  allImagePaths[name] = maxFilePath;
}

/** 最终的 id 到图片名的映射 */
const result: Record<number, string> = {
  "0": "UI_Gcg_Buff_Common_Element_Physics",
  "1": "UI_Gcg_Buff_Common_Element_Ice",
  "2": "UI_Gcg_Buff_Common_Element_Water",
  "3": "UI_Gcg_Buff_Common_Element_Fire",
  "4": "UI_Gcg_Buff_Common_Element_Electric",
  "5": "UI_Gcg_Buff_Common_Element_Wind",
  "6": "UI_Gcg_Buff_Common_Element_Rock",
  "7": "UI_Gcg_Buff_Common_Element_Grass",
  "9": "UI_Gcg_Buff_Common_Element_Heal",
};
/** 需要处理（保存并生成缩略图）的图片名集合 */
const imagesToProcess = new Set<string>(Object.values(result));

const replaceNameMap: Record<string, string> = {
  UI_Gcg_CardFace_Summon_AbyssEle: "UI_Gcg_CardFace_Summon_AbyssEle_Layer00",
  UI_Gcg_CardFace_Char_Monster_Effigyice:
    "UI_Gcg_CardFace_Char_Monster_EffigyIce",
};

// 召唤物、角色牌、行动牌
for (const obj of data) {
  if (!obj.image) {
    continue;
  }
  let filename = obj.image.filename_cardface;
  if (filename in replaceNameMap) {
    filename = replaceNameMap[filename];
  }
  if (!(filename in allImagePaths)) {
    console.warn(`Missing image: ${filename}`);
    continue;
  }
  result[obj.id] = filename;
  imagesToProcess.add(filename);
}
// 技能图标
for (const [id, name] of Object.entries(skillImageNames)) {
  const filepath = allImagePaths[name];
  if (!(name in allImagePaths)) {
    console.warn(`Missing image of skill: ${name}`);
    continue;
  }
  result[Number(id)] = name;
  imagesToProcess.add(name);
}
// 已确定的状态图标
for (const [id, name] of Object.entries(statusImageNames)) {
  if (id in result) {
    continue;
  }
  if (name === null) {
    // 还不知道它的图标是什么，先凑个数
    result[Number(id)] = "UI_Gcg_Buff_Common_Special";
  }
  const filepath = allImagePaths[name];
  if (filepath) {
    result[Number(id)] = name;
  } else {
    console.warn(`Missing image of skill: ${name}`);
  }
}
// 将所有状态图标加入处理集合
for (const statusImageName of Object.keys(allImagePaths).filter(
  (key) => key.startsWith("UI_Gcg_Buff") || key.startsWith("UI_Gcg_Debuff"),
)) {
  imagesToProcess.add(statusImageName);
}

const generatedImageListPath = path.join(outputDir, "./imageList.json");
await writeFile(generatedImageListPath, JSON.stringify([...imagesToProcess], void 0, 2));

const resultPath = path.join(outputDir, "./imageNames.json");
for (const name of imagesToProcess) {
  const filepath = allImagePaths[name];
  const image = Sharp(filepath);
  const outputPath = path.join(imageDir, `${name}.webp`);
  await image.toFile(outputPath);
  console.log(`Generated image for ${name}`);
}
await writeFile(resultPath, JSON.stringify(result, void 0, 2));
