<script lang="ts" setup>
import { AlertTriangleIcon, File02Icon } from '@components/basic/icons'

import { getList, type ServiceListItem } from '../services/services'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  allModel: any
  modelValue: any
  error?: string
}>()

watch(
  () => props.allModel?.medicalExamType,
  async (value) => {
    if (value) {
      await loadRows()
    }
  }
)

const emit = defineEmits(['update:modelValue'])

const rows = ref<ServiceListItem[]>([])

const validServices = computed(() =>
  rows.value.filter((r) => r.missingExams.length === 0)
)

const invalidServices = computed(() =>
  rows.value.filter((r) => r.missingExams.length > 0)
)

const hasInvalidServices = computed(() => invalidServices.value.length > 0)

const loadRows = async () => {
  rows.value = await getList(
    props.allModel?.contract,
    props.allModel?.medicalExamType
  )

  // Only emit valid services — if any are invalid, this prevents form submission
  // when all services are invalid (empty array fails required-array rule)
  if (hasInvalidServices.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', rows.value)
  }
}

onMounted(async () => {
  await loadRows()
})
</script>
<template>
  <div class="w-full">
    <div
      v-if="hasInvalidServices"
      class="mb-2 p-3 bg-red-50 border border-red-200 rounded-md"
    >
      <p class="text-sm font-medium text-red-700 flex items-center gap-1">
        <AlertTriangleIcon class="w-4 h-4" />
        Algunos servicios tienen exámenes no encontrados. No se puede crear la
        orden hasta corregir la configuración.
      </p>
    </div>
    <ul class="w-full">
      <li
        v-for="(row, i) in rows"
        :key="i"
        class="w-full flex items-center gap-3 p-3"
        :class="
          row.missingExams.length > 0
            ? 'bg-red-50 text-red-700'
            : 'hover:bg-gray-50'
        "
      >
        <component
          :is="row.missingExams.length > 0 ? AlertTriangleIcon : File02Icon"
          class="w-5 h-5 flex-shrink-0"
        />
        <div class="flex-1">
          <span>{{ row.code }} - {{ row.name }}</span>
          <p v-if="row.missingExams.length > 0" class="text-xs text-red-500">
            Exámenes no encontrados: {{ row.missingExams.join(', ') }}
          </p>
        </div>
      </li>
    </ul>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
