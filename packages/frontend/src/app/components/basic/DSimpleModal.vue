<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

import { XIcon } from './icons'

const emits = defineEmits(['close'])

const closeModal = () => {
  emits('close')
}

onMounted(async () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})
</script>

<template>
  <div
    class="fixed w-screen h-screen p-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative w-full h-full bg-white rounded-2xl p-5">
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
        @click="closeModal"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div class="w-full h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
