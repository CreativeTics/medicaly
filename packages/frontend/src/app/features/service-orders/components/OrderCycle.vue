<script lang="ts" setup>
import { OrderCycleTypes } from '@/app/core/types/order-cycle-types'
import { OrderStatus as OrderStatusEnum } from '@/app/core/types/order-status'
import { formatDate } from '@/app/core/util/dates'
import { RefreshCcw02Icon } from '@components/basic/icons'
import Popper from 'vue3-popper'
import OrderStatus from './OrderStatus.vue'

defineProps<{
  orderCycle: {
    user: string
    type: OrderCycleTypes
    employee: any
    status: OrderStatusEnum
    at: string
  }[]
}>()
</script>
<template>
  <Popper
    arrow
    offsetDistance="12"
    content="Ciclo de la orden"
    :hover="true"
    placement="bottom"
  >
    <div class="bg-white rounded-md py-2">
      <RefreshCcw02Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
    </div>
    <template #content>
      <div class="flex flex-col gap-2 p-5 bg-white rounded-lg shadow-lg">
        <div class="flex items-center justify-center gap-2">
          <span class="text-lg font-semibold">Ciclo de la orden</span>
        </div>
        <div
          v-for="(cycle, index) in orderCycle"
          :key="index"
          class="grid grid-cols-3 items-center hover:bg-gray-50 p-2 rounded-lg"
        >
          <div class="flex flex-col items-center">
            <span class="text-xs text-gray-500">{{
              formatDate(cycle.at, true)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-xs text-gray-700">({{ cycle.type }})</span>
            <OrderStatus :status="cycle.status" />
          </div>
          <div v-if="cycle.employee" class="flex-1 flex flex-col">
            <span class="text-xs text-gray-700">{{ cycle.user }}</span>
            <span class="text-xs text-gray-700">{{ cycle.employee.name }}</span>
            <span class="text-xs text-blue-900">{{
              cycle.employee.position
            }}</span>
          </div>
          <div v-else class="flex-1 flex flex-col">
            <span class="text-xs text-gray-700">{{ cycle.user }}</span>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>
