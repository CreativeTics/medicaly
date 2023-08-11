<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    label?: string;
    color?: string;
  }>(),
  {
    modelValue: false,
    disabled: false,
    hidden: false,
    label: "",
    color: "rgb(37 99 235)",
  }
);

const emit = defineEmits(["update:modelValue"]);

const emitChange = (e: any) => {
  emit("update:modelValue", e.target.checked);
};
</script>
<template>
  <label
    class="flex items-center cursor-pointer"
    :class="[hidden ? 'hidden' : '']"
  >
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        type="checkbox"
        :disabled="disabled"
        class="sr-only"
        :checked="modelValue"
        @value="modelValue"
        @input="emitChange"
      />
      <!-- line -->
      <div class="base block bg-gray-200 w-10 h-5 rounded-full"></div>
      <!-- dot -->
      <div
        class="dot absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full transition"
      ></div>
    </div>
    <!-- label -->
    <div class="ml-2 text-sm font-medium text-gray-700">{{ label }}</div>
  </label>
</template>
<style scoped>
/* Toggle B */
input:checked ~ .dot {
  transform: translateX(100%);
}

input:checked ~ .base {
  background-color: v-bind(color);
}
</style>
