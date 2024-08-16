<script setup lang="ts">
import { OrderStatus } from '@/app/core/types/order-status'

defineProps<{
  status?: OrderStatus
}>()
</script>

<template>
  <div class="max-w-xs overflow-hidden">
    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
      v-if="status === OrderStatus.completed"
    >
      {{ status }}
    </span>
    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
      v-else-if="status === OrderStatus.cancelled"
    >
      {{ status }}
    </span>
    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
      v-else-if="status === OrderStatus.pending"
    >
      {{ status }}
    </span>

    <span
      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
      v-else-if="status === OrderStatus.inprogress"
    >
      {{ status }}
    </span>
  </div>
</template>
