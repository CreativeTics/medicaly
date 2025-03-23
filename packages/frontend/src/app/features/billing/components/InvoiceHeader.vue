<script setup lang="ts">
import { formatDate } from '@/app/core/util/dates'
import { DBtn, DTextField } from '@components/basic'
import {
  Download02Icon,
  Edit03Icon,
  XIcon,
  Save01Icon,
} from '@components/basic/icons'
import { ref, watch } from 'vue'
import Popper from 'vue3-popper'

const props = defineProps<{
  invoice: any
}>()

const emit = defineEmits(['download', 'changeInvoiceNumber'])

const isEditing = ref(false)

const invoiceNumber = ref('')
const invoiceNumberError = ref('')

const editInvoiceNumber = () => {
  isEditing.value = true
}

const saveInvoiceNumber = () => {
  if (!invoiceNumber.value) {
    invoiceNumberError.value = 'El número de factura es requerido'
    return
  }

  isEditing.value = false
  invoiceNumberError.value = ''
  emit('changeInvoiceNumber', invoiceNumber.value)
}

const cancelInvoiceNumberEdit = () => {
  isEditing.value = false
  invoiceNumber.value = props.invoice?.invoiceNumber
  invoiceNumberError.value = ''
}

watch(
  () => props.invoice?.invoiceNumber,
  (newValue) => {
    invoiceNumber.value = newValue
  }
)
</script>

<template>
  <div
    class="w-full rounded-md shadow-sm bg-white p-5 mb-2 grid grid-cols-4 gap-2"
  >
    <div class="flex flex-col">
      <span class="text-sm font-semibold">
        Sede: {{ invoice?.subsidiaryName }}
      </span>

      <span class="text-sm font-semibold">
        Contrato: {{ invoice?.contractName }}
      </span>
      <span class="text-sm font-semibold">
        Ordenes desde: {{ formatDate(invoice?.startDate) }} hasta
        {{ formatDate(invoice?.endDate) }}
      </span>
      <span class="text-xs">
        Creada: {{ formatDate(invoice?.createdAt, true) }}
      </span>
    </div>
    <div class="flex flex-col col-span-2">
      <span class="text-sm font-semibold"> # Factura </span>
      <span class="text-sm font-semibold flex gap-2">
        <DTextField
          v-model="invoiceNumber"
          class="w-64"
          placeholder="Número de Factura"
          :disabled="!isEditing"
          :error="invoiceNumberError"
        />
        <Popper
          v-if="!isEditing"
          arrow
          offsetDistance="12"
          content="Editar"
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div class="bg-gray-50 rounded-md py-2" @click="editInvoiceNumber">
            <Edit03Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper>
        <Popper
          v-if="isEditing"
          arrow
          offsetDistance="12"
          content="Guardar"
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div class="bg-gray-50 rounded-md py-2" @click="saveInvoiceNumber">
            <Save01Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper>
        <Popper
          v-if="isEditing"
          arrow
          offsetDistance="12"
          content="Cancelar"
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div
            class="bg-gray-50 rounded-md py-2"
            @click="cancelInvoiceNumberEdit"
          >
            <XIcon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper>
      </span>
    </div>
    <div class="flex justify-end items-end">
      <DBtn color="success" @click="emit('download')">
        <Download02Icon class="h-6 w-6" />
        Descargar Cuadro
      </DBtn>
    </div>
  </div>
</template>
