<script setup lang="ts">
import { AlertTriangleIcon } from './icons'
</script>

<template>
  <div
    class="min-w-min w-1/3 h-min bg-amber-200 text-amber-600 p-2 rounded-lg flex items-center gap-2"
  >
    <AlertTriangleIcon class="h-6 w-6" />
    <slot></slot>
  </div>
</template>
