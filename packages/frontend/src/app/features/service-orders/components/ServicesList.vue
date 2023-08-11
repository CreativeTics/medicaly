<script lang="ts" setup>
import { File02Icon } from "../../../components/basic";

import { getList } from "../services/services";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  allModel: any;
  modelValue: any;
  error?: string;
}>();

watch(
  () => props.allModel?.medicalExamType,
  async (value) => {
    if (value) {
      await loadRows();
    }
  }
);

const emit = defineEmits(["update:modelValue"]);

const rows = ref<any[]>([]);

const loadRows = async () => {
  rows.value = await getList(
    props.allModel?.contract,
    props.allModel?.medicalExamType
  );

  emit("update:modelValue", rows.value);
};

onMounted(async () => {
  await loadRows();
});
</script>
<template>
  <div class="w-full">
    <ul class="w-full hover:bg-gray-50">
      <li class="w-full flex gap-3 p-3" v-for="(row, i) in rows" :key="i">
        <File02Icon />
        {{ row.code }} -
        {{ row.name }}
      </li>
    </ul>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
