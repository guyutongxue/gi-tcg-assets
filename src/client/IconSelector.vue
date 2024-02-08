<script lang="ts" setup>
import { onMounted } from "vue";
import { watch } from "vue";
import { onUpdated } from "vue";
import { ref } from "vue";

const menu = ref(false);

const props = defineProps<{
  modelValue: string | null | undefined;
  imageList: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

function toggleImageSelection(image: string) {
  if (props.modelValue === image) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", image);
  }
}

</script>

<template>
  <div class="text-center">
    <v-btn rounded>
      <img v-if="modelValue" :src="`/assets/${modelValue}.webp`" width="35" />
      <span v-else>选择图标</span>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom center"
        activator="parent"
      >
        <v-card width="400" height="300">
          <v-card-text>
            <v-row>
              <v-col
                cols="2"
                v-for="image of imageList"
                class="image-container rounded"
                @click="toggleImageSelection(image)"
                :class="{ 'bg-grey-lighten-3': modelValue === image }"
              >
                <img :src="`/assets/${image}.webp`" class="image">
                <v-icon
                  v-if="modelValue === image"
                  class="selected-chip"
                  color="green"
                  icon="mdi-checkbox-marked-circle"
                  size="25"
                >
                </v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-btn>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-container:hover {
  background-color: #fafafa;
}
.selected-chip {
  position: absolute;
  bottom: 0;
  right: 0;
}

.image {
  width: 100%;
}
</style>
