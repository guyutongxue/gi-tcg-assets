# gi-tcg-assets

```
AssetStudioCLI --silent "<path_to_genshin_impact_games>\YuanShen_Data\StreamingAssets\AssetBundles\blocks" images --types Sprite --game GI --names "^UI_Gcg_(Buff|Cardface|Debuff)|^Skill_|^MonsterSkill_"
```


```mermaid
graph TB;
genshin:[Genshin client] --AssetStudioCLI--> sprite:[Sprite folder]
genshinData:[GenshinData Repo] --"theBowja/GenshinData_scripts"-->npmdb:[@genshin-db/tcg]
npmdb:---->skillName:
npmdb:---->genImageTs:[/node/generate_images.ts/]
ambr:[ambr.top] --"node/get_skill_image_names.ts"-->skillName:[skillImageNames.json]
skillName:---->genImageTs:
sprite:---->genImageTs:
genImageTs:---->webp:[dist/assets/*.webp]
webp:--"node/generate_thumbs.ts"-->webpThumb:[dist/assets/thumbs/*.webp]
genImageTs:---->imageList:[imageList.json]
genImageTs:---->imageNames:[imageNames.json]
imageList:---->frontend:["client/* (Buff Icon Edit Page)"]
webp:---->frontend:
frontend:--"Manual update"-->statusImage:[statusImageNames.json]
statusImage:---->genImageTs:
statusImage:---->frontend:

webp:-...->api:[Vercel Functions]
webpThumb:-...->api:
npmdb:-...->api:
imageNames:-...->api:
```