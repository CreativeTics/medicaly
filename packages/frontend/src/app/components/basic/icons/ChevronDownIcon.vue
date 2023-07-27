<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    dataId: string
  }>(),
  {
    id: '',
    dataId: ''
  }
)
</script>
<template>
  <svg
    :id="id"
    :data-id="dataId"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <rect width="1144" height="1140" transform="translate(-608 -276)" fill="none" />
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>
</template>
