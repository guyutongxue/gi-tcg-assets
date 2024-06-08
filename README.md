# gi-tcg-assets

此仓库存放用于生成七圣召唤模拟器静态资产的代码。资产产生路径如下：

```mermaid
flowchart TB;
genshin:[Genshin client] --AssetStudioCLI--> sprite:[Sprite folder];
genshinData:[GenshinData Repo] --"theBowja/GenshinData_scripts"-->npmdb:["@genshin-db/tcg"];
npmdb:---->skillName:;
npmdb:---->genImageTs:[/"node/generate_images.ts"/];
ambr:[ambr.top] --"node/get_skill_image_names.ts"-->skillName:[skillImageNames.json];
skillName:---->genImageTs:;
sprite:---->genImageTs:;
genImageTs:---->webp:["dist/assets/*.webp"];
webp:--"node/generate_thumbs.ts"-->webpThumb:["dist/assets/thumbs/*.webp"];
genImageTs:---->imageList:[imageList.json];
genImageTs:---->imageNames:[imageNames.json];
imageList:---->frontend:["client/* (Buff Icon Edit Page)"];
npmdb:---->statusData:[statusData.json];
statusData:---->frontend:;
webp:---->frontend:;
frontend:--"Manual update"-->statusImage:[statusImageNames.json];
statusImage:---->genImageTs:;
statusImage:---->frontend:;

webp:-...->api:[Vercel Functions];
webpThumb:-...->api:;
npmdb:-...->api:;
imageNames:-...->api:;
```

其中 [AssetStudio](https://github.com/yarik0chka/YarikStudio) 的命令为：

> 编译前设置 `AssetStudio.CLI/App.config` 的 `allowDuplicates` 为 `True`

```
.\AssetStudio.CLI.exe --silent "D:\Genshin Impact Game\YuanShen_Data\StreamingAssets\AssetBundles\blocks" "D:\gi-assets"  --types Sprite --game GI --names "^UI_Gcg_(Buff|Cardface|Debuff)|^Skill_|^MonsterSkill_"
```
