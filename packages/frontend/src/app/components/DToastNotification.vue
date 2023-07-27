<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertHexagonIcon,
  AnnotationInfoIcon,
  XIcon,
} from "@components/basic/icons";

const props = defineProps({
  title: {
    type: String,
    default: "title",
  },
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "success",
  },
  time: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["close"]);

interface Type {
  icon: any;
  bgColor: string;
  textColor: string;
}

const types = new Map<string, Type>([
  [
    "success",
    {
      icon: CheckCircleIcon,
      bgColor: "bg-lime-500",
      textColor: "text-lime-500",
    },
  ],
  [
    "error",
    {
      icon: AlertHexagonIcon,
      bgColor: "bg-red-500",
      textColor: "text-red-500",
    },
  ],
  [
    "warning",
    {
      icon: AlertTriangleIcon,
      bgColor: "bg-amber-500",
      textColor: "text-amber-500",
    },
  ],
  [
    "info",
    {
      icon: AnnotationInfoIcon,
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
    },
  ],
]);

const percent = ref(100);

const onClose = () => {
  emit("close");
};

const counter = () => {
  const total = props.time / 10;
  let actual = total;
  const interval = setInterval(() => {
    actual -= 1;
    percent.value = (100 * actual) / total;
    if (percent.value <= 0) {
      clearInterval(interval);
      onClose();
    }
  }, 10);
};

onMounted(() => {
  counter();
});
</script>
<template>
  <div
    class="relative overflow-hidden w-full bg-white shadow-lg rounded-lg flex justify-between mb-2 border border-gray-100"
  >
    <div class="px-2 py-3 flex justify-center items-start">
      <component
        :is="types.get(type)?.icon"
        class="h-8"
        :class="types.get(type)?.textColor"
      />
    </div>
    <div class="w-full py-4">
      <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
      <!-- eslint-disable vue/no-v-html -->
      <p class="text-sm text-gray-500" v-html="text"></p>
      <!--eslint-enable-->
    </div>
    <div class="p-2">
      <XIcon class="h-6 text-gray-400 cursor-pointer" @click="onClose" />
    </div>
    <div class="absolute bottom-0 w-full bg-gray-50 h-1">
      <div
        class="h-1"
        :style="{ width: `${percent}%` }"
        :class="types.get(type)?.bgColor"
      ></div>
    </div>
  </div>
</template>
