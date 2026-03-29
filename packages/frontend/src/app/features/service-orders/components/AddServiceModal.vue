<script setup lang="ts">
import DSimpleModal from '@components/basic/DSimpleModal.vue'
import { AlertTriangleIcon } from '@components/basic/icons'
import { computed, onMounted, ref } from 'vue'
import { getList, type ServiceListItem } from '../services/services'
import { DTextField, DBtn } from '@components/basic'
import { XIcon, PlusCircleIcon } from '@components/basic/icons'

const props = defineProps<{
  orderServicesIds?: string[]
  contractId: string
}>()

const emits = defineEmits(['close', 'confirm'])

const search = ref('')
const selectedServices = ref<ServiceListItem[]>([])

const allServices = ref<ServiceListItem[]>([])

const filteredServices = computed(() => {
  return allServices.value
    .filter((service) => !props.orderServicesIds?.includes(service.id))
    .filter(
      (service) => !selectedServices.value.find((s) => s.id === service.id)
    )
    .filter((service) =>
      service.name.toLowerCase().includes(search.value.toLowerCase())
    )
})

const hasInvalidSelected = computed(() =>
  selectedServices.value.some((s) => s.missingExams.length > 0)
)

const closeModal = () => {
  emits('close')
}

const confirm = () => {
  if (selectedServices.value.length == 0) return
  if (hasInvalidSelected.value) return
  emits('confirm', selectedServices.value)
}

onMounted(async () => {
  // Cargar servicios disponibles para el contrato
  console.log('Mounted modal for contract', props.contractId)
  allServices.value = await getList(props.contractId)
})
</script>

<template>
  <DSimpleModal @close="closeModal">
    <div class="w-full h-full p-4 flex flex-col">
      <div class="flex-1 flex flex-col">
        <DTextField
          v-model="search"
          placeholder="Buscar servicios..."
          class="mb-4"
          icon="SearchLgIcon"
        />

        <div
          class="w-full flex flex-col items-stretch gap-2 mb-4 flex-1 overflow-y-auto"
        >
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="rounded-lg shadow-sm p-1 flex items-center"
            :class="
              service.missingExams.length > 0
                ? 'bg-red-50 text-red-700 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 cursor-pointer'
            "
            @click="
              service.missingExams.length === 0 &&
                selectedServices.push(service)
            "
          >
            <div class="flex-1">
              <span>{{ service.code }} - {{ service.name }}</span>
              <p
                v-if="service.missingExams.length > 0"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <AlertTriangleIcon class="w-3 h-3" />
                Exámenes no encontrados: {{ service.missingExams.join(', ') }}
              </p>
            </div>
            <PlusCircleIcon
              v-if="service.missingExams.length === 0"
              class="w-4 h-4 ml-auto text-gray-500"
            />
          </div>
        </div>

        <hr />

        <div class="w-full flex flex-col items-stretch gap-2 mb-4">
          <div
            v-for="service in selectedServices"
            :key="service.id"
            class="bg-white hover:bg-gray-100 cursor-pointer rounded-lg shadow-sm p-1 flex items-center text-green-700"
            @click="
              selectedServices = selectedServices.filter(
                (s) => s.id !== service.id
              )
            "
          >
            {{ service.code }} - {{ service.name }}
            <XIcon class="w-4 h-4 ml-auto text-gray-500" />
          </div>
        </div>
      </div>
      <div class="w-full flex items-center justify-end gap-2 mt-4">
        <DBtn @click="confirm" :disabled="selectedServices.length == 0"
          >Agregar ({{ selectedServices.length }}) servicios</DBtn
        >
      </div>
    </div>
  </DSimpleModal>
</template>
