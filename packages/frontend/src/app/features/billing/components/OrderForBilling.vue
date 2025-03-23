<script setup lang="ts">
import { formatCurrency } from '@/app/core/util/currencies'
import { formatDate } from '@/app/core/util/dates'

defineProps<{
  order: any
}>()
</script>

<template>
  <div
    class="w-full rounded-md shadow-sm bg-white p-5 mb-2 grid grid-cols-8 gap-2"
  >
    <span class="text-sm font-semibold overflow-ellipsis">
      {{ order?.code }}
    </span>
    <span class="text-sm font-semibold overflow-ellipsis">
      {{ order?.contractSubsidiary }}
    </span>
    <span class="text-sm col-span-2 font-semibold overflow-ellipsis">
      {{ order?.patientName }}
    </span>
    <span class="text-sm font-semibold overflow-ellipsis break-words">
      {{ order?.medicalExamTypeName }}
    </span>
    <span class="text-sm">
      <ul>
        <li v-for="service in order?.services">
          {{ service?.code }}-{{ service?.name }}:
          {{ formatCurrency(service?.amount) }}
        </li>
      </ul>
    </span>
    <span class="text-sm">
      {{ formatDate(order?.createdAt, true) }}
    </span>
    <span class="text-sm flex justify-between">
      {{ formatDate(order?.finalizedAt, true) }}

      <slot> </slot>
    </span>
  </div>
</template>
