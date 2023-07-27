<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    class?: string
  }>(),
  {
    class: 'text-gray-500'
  }
)
</script>
<template>
  <component :is="name" :class="class" />
</template>
