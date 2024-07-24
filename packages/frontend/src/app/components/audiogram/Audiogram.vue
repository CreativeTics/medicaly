<script setup lang="ts">
import { onMounted } from 'vue'

import { useAudiogram } from './useAudiogram'

const { init, audiogramConfig } = useAudiogram()

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  if (!canvas) return
  init(canvas)
})
</script>

<template>
  <div class="w-full grid grid-cols-1 sm:grid-cols-3">
    <div class="w-full border flex flex-col items-center justify-start">
      <div></div>

      <table class="w-full border">
        <thead class="border">
          <tr>
            <th colspan="2" class="text-center">Promedio tonal</th>
          </tr>
          <tr>
            <th class="text-center">Oído Izq</th>
            <th class="text-center">Oído Der</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">100</td>
            <td class="text-center">200</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-span-2 border flex items-center justify-center">
      <canvas id="canvas"> </canvas>
    </div>
  </div>
  <!-- {{ audiogram }} -->
</template>
