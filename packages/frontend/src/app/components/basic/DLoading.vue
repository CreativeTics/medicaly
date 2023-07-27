<script setup lang="ts">
import { Loading02Icon } from './icons'
withDefaults(
  defineProps<{
    message: string
  }>(),
  {
    message: 'Loading...'
  }
)
</script>
<template>
  <div
    class="fixed flex flex-col gap-5 justify-center items-center inset-0 bg-gray-600 bg-opacity-75 z-50">
    <Loading02Icon class="rotate h-14 w-14 text-white" />
    <p class="text-gray-200 italic font-semibold tracking-wide">
      {{ message }}
    </p>
  </div>
</template>
<style>
.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
