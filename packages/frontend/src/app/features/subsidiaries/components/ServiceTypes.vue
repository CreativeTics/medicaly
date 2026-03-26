<script lang="ts" setup>
import { DBtn, DSelectFieldSearch, DTextField } from '@components/basic'
import { Trash03Icon } from '@components/basic/icons'
import { ref, watch, onMounted } from 'vue'

interface ServiceType {
  code: string
  name: string
  distinctiveNumber: string
}

const serviceOptions = [
  { id: '328', name: '328 - Medicina General' },
  { id: '407', name: '407 - Medicina del trabajo y medicina Laboral' },
]

const props = defineProps<{
  modelValue: any[]
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])

const items = ref<ServiceType[]>([])
const selectedService = ref('')
const distinctiveNumber = ref('')

onMounted(() => {
  if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    items.value = [...props.modelValue]
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length > 0 && items.value.length === 0) {
      items.value = [...newVal]
    }
  },
  { deep: true }
)

watch(
  () => items.value,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)

const addItem = () => {
  if (!selectedService.value) return

  const already = items.value.some((i) => i.code === selectedService.value)
  if (already) return

  const option = serviceOptions.find((o) => o.id === selectedService.value)
  if (!option) return

  items.value.push({
    code: option.id,
    name: option.name,
    distinctiveNumber: distinctiveNumber.value.trim(),
  })
  selectedService.value = ''
  distinctiveNumber.value = ''
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-end gap-3 mb-3">
      <DSelectFieldSearch
        label="Servicio a Prestar"
        id="serviceType"
        v-model="selectedService"
        :options="serviceOptions"
        class="w-80"
      />
      <DTextField
        label="Número Distintivo"
        id="distinctiveNumber"
        v-model="distinctiveNumber"
        placeholder="Alfanumérico (opcional)"
        class="w-48"
      />
      <DBtn type="button" color="default" @click="addItem"> Agregar </DBtn>
    </div>

    <table v-if="items.length > 0" class="table-auto w-full">
      <thead>
        <tr class="bg-gray-50">
          <th class="text-left px-3 py-2 text-sm font-semibold text-gray-600">
            #
          </th>
          <th class="text-left px-3 py-2 text-sm font-semibold text-gray-600">
            Código
          </th>
          <th class="text-left px-3 py-2 text-sm font-semibold text-gray-600">
            Servicio
          </th>
          <th class="text-left px-3 py-2 text-sm font-semibold text-gray-600">
            Nro. Distintivo
          </th>
          <th class="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in items"
          :key="i"
          class="hover:bg-gray-50 border-b border-gray-100"
        >
          <td class="px-3 py-2 text-sm">{{ i + 1 }}</td>
          <td class="px-3 py-2 text-sm">{{ item.code }}</td>
          <td class="px-3 py-2 text-sm">{{ item.name }}</td>
          <td class="px-3 py-2 text-sm">{{ item.distinctiveNumber || '—' }}</td>
          <td class="px-3 py-2">
            <div class="flex justify-end">
              <div
                class="bg-gray-50 rounded-md py-1 px-1 cursor-pointer hover:bg-red-50"
                @click="removeItem(i)"
              >
                <Trash03Icon class="h-5 w-5 text-gray-500 hover:text-red-500" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="text-sm text-gray-400 italic">
      No se han agregado servicios
    </p>

    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
