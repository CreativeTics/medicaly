<script setup lang="ts">
import { OrderStatus } from '@/app/core/types/order-status'

defineProps<{
  status?: OrderStatus
  text?: string
}>()
</script>

<template>
  <div class="max-w-xs overflow-hidden">
    <span
      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
      v-if="status === OrderStatus.completed"
    >
      {{ text }}
    </span>
    <span
      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
      v-else-if="status === OrderStatus.cancelled"
    >
      {{ text }}
    </span>
    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
      v-else-if="status === OrderStatus.pending"
    >
      {{ text }}
    </span>

    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
      v-else-if="status === OrderStatus.inprogress"
    >
      {{ text }}
    </span>
  </div>
</template>
