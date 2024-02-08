<script setup lang="ts">
import { ref, watch, computed } from "vue";
import icons from "../output/statusImageNames.json";
import allImageList from "../output/imageList.json";
import official from "../output/statusData.json";
import IconSelector from "./IconSelector.vue";

const imageList = allImageList.filter(
  (c) => c.startsWith("UI_Gcg_Buff") || c.startsWith("UI_Gcg_Debuff"),
);

const m = ref<Record<string, string | null>>(icons);

function preventClose(event: BeforeUnloadEvent) {
  event.preventDefault();
}

watch(m.value, (value) => {
  window.addEventListener("beforeunload", preventClose);
});

const ratio = computed(() => {
  const total = official.length;
  const values = Object.values(m.value);
  const filled = values.filter((v) => v).length;
  return `${((100 * filled) / total).toFixed(2)}%`;
});

function exportData() {
  const data = JSON.stringify(m.value, void 0, 2);
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "statusImageNames.json";
  a.click();
  URL.revokeObjectURL(url);
}

const filterNull = ref(false);
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>Buff Icon Edit Page</v-app-bar-title>
      <template v-slot:append>
        <v-btn variant="elevated" color="green" @click="exportData">导出</v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <p>
          目前图标覆盖率:
          {{ ratio }}。如果你有要补充或修正的图标，请在此页修改后，在右上角导出
          JSON 文件，随后提交 PR 到
          <a
            href="https://github.com/Guyutongxue/gcg-buff-icon-data/edit/main/src/data/icons.json"
            target="_blank"
          >
            GitHub
          </a>
          ，谢谢！
        </p>
        <v-switch
          label="仅显示无图标"
          v-model="filterNull"
          color="primary"
        ></v-switch>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">id</th>
              <th class="text-left">名称</th>
              <th class="text-left">图标</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item of official" :key="item.name">
              <tr v-if="!filterNull || !m[item.id]">
                <td>{{ item.id }}</td>
                <td>
                  <v-chip
                    v-if="item.cardtype === 'GCG_CARD_ONSTAGE'"
                    color="green"
                  >
                    出战
                  </v-chip>
                  <v-chip
                    v-else-if="item.cardtype === 'GCG_CARD_SUMMON'"
                    color="purple"
                  >
                    召唤物
                  </v-chip>
                  <v-chip v-else color="orange"> 角色 </v-chip>
                  {{ item.name }}
                  <v-tooltip
                    :text="item.description"
                    activator="parent"
                    location="bottom"
                  >
                  </v-tooltip>
                </td>
                <td>
                  <icon-selector v-model="m[item.id]" :imageList="imageList" />
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-container>
    </v-main>
  </v-layout>
</template>
