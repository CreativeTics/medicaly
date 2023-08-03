<script setup lang="ts">
const emit = defineEmits(["closeBackdrop"]);
withDefaults(
  defineProps<{
    class?: string;
  }>(),
  {
    class: "",
  }
);

const emitCloseBackdrop = () => {
  emit("closeBackdrop");
};
</script>

<template>
  <Teleport to="body" :class="class">
    <div
      class="fixed top-0 left-0 z-40 h-screen w-screen bg-black opacity-20"
      @click="emitCloseBackdrop"
    ></div>
    <div class="h-screen w-1/3 fixed z-50 bg-white shadow-xl right-0 top-0">
      <slot></slot>
    </div>
  </Teleport>
</template>
