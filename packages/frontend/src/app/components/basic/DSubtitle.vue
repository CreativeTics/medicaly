<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '',
  }
)
</script>
<template>
  <div class="text-sm font-semibold text-gray-500 mt-4 w-full">
    {{ text }}
  </div>
</template>
