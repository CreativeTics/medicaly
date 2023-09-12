<script setup lang="ts">
import { onMounted } from 'vue'

import { useAudiogram } from './useAudiogram'

const { init, audiogram } = useAudiogram()

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  if (!canvas) return
  init(canvas)
})
</script>

<template>
  <div>
    <canvas id="canvas"> </canvas>
    {{ audiogram }}
  </div>
</template>
