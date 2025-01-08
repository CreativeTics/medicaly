<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getOrdersForPatient,
  PatientOrder,
  Patient,
  getPatientById,
  getPrintUrl,
  downloadConsent,
} from '../services'
import { DBtn } from '@components/basic'
import OrderStatus from '@features/service-orders/components/OrderStatus.vue'
import Popper from 'vue3-popper'
const PaginatedTable = defineAsyncComponent(
  () => import('@/app/components/PaginatedTable.vue')
)
const PatientHeader = defineAsyncComponent(
  () => import('../components/PatientHeader.vue')
)

import {
  SearchMdIcon,
  PrinterIcon,
  Loading01Icon as DLoadingIcon,
  ArrowRightIcon,
  XIcon,
} from '@components/basic/icons'

import { OrderStatus as OrderStatusEnum } from '@/app/core/types/order-status'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const patient = ref<Patient>()
const modalIsOpen = ref(false)

const columns = [
  {
    key: 'code',
    title: '# de orden',
    align: 'left',
  },
  {
    key: 'medicalExamType',
    title: 'Tipo de servicio',
    align: 'left',
  },
  {
    key: 'status',
    title: 'Estado',
    align: 'left',
  },
  {
    key: 'admissionDate',
    title: 'Fecha de Admisión',
    align: 'left',
  },
  {
    key: 'endAttentionDate',
    title: 'Fecha de Salida',
    align: 'left',
  },
  {
    key: 'informedConsents',
    title: '',
    align: 'left',
  },
  {
    key: 'actions',
    title: '',
  },
]

const data = ref<PatientOrder[]>([])

const selectedUrl = ref('')
const iframe = ref<HTMLIFrameElement>()
const printingTicket = ref('')
const generatePrint = async (ticketId: string) => {
  printingTicket.value = ticketId
  console.log('Generate print', ticketId)
  // print only iframe content
  selectedUrl.value = getPrintUrl(ticketId)
  await new Promise((resolve) => setTimeout(resolve, 5000))
  if (iframe.value?.contentWindow) iframe.value?.contentWindow?.print()

  printingTicket.value = ''
}

const handleDownloadConsent = async (orderId: string, consent: any) => {
  consent.isLoading = true
  selectedUrl.value = (await downloadConsent(orderId, consent.code)) || ''
  consent.isLoading = false
  modalIsOpen.value = true
}

const openHistoryModal = (ticketId: string) => {
  selectedUrl.value = getPrintUrl(ticketId)
  modalIsOpen.value = true
}

onMounted(async () => {
  if (route.params.id) {
    patient.value = await getPatientById(route.params.id.toString())
    loading.value = true
    data.value = await getOrdersForPatient(route.params.id.toString())
    loading.value = false
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalIsOpen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalIsOpen.value = false
    }
  })
})
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <div class="leading-4 pt-responsive">
      <p class="text-2xl font-semibold text-shadow">
        Historia clínica # {{ patient?.document }}
      </p>
      <p class="text-gray-500 text-shadow"></p>
    </div>
    <div class="w-full flex-grow flex overflow-y-hidden">
      <div
        class="flex-grow h-full rounded-xl bg-white shadow-lg p-5 flex flex-col"
      >
        <div class="sm:flex justify-between pt-2">
          <PaginatedTable
            :columns="[...columns]"
            :rows="data"
            style="height: calc(100vh - 200px)"
          >
            <template #header>
              <div class="bg-gray-50 w-full flex justify-between">
                <PatientHeader v-if="patient?.id" :patient="patient" />
              </div>
            </template>
            <template #row="rowProps">
              <td
                v-for="column in rowProps.columns"
                v-bind:key="column.key"
                class="px-3"
              >
                <div
                  class="w-full"
                  v-if="
                    !['actions', 'status', 'informedConsents'].includes(
                      column.key
                    )
                  "
                >
                  {{ rowProps.row[column.key] }}
                </div>

                <div class="max-w-xs gap-2" v-else-if="column.key === 'status'">
                  <OrderStatus :status="rowProps.row.status" />
                </div>
                <div
                  class="max-w-xs gap-2"
                  v-else-if="column.key === 'informedConsents'"
                >
                  <ul>
                    <li v-for="consent in rowProps.row?.informedConsents">
                      <span
                        v-if="
                          rowProps.row?.status == OrderStatusEnum.completed &&
                          consent.accepted
                        "
                        class="text-sm text-blue-800 flex gap-2 cursor-pointer"
                        @click="handleDownloadConsent(rowProps.row.id, consent)"
                      >
                        <ArrowRightIcon class="h-6 w-6 mx-2" />
                        {{ consent.name }}
                        <DLoadingIcon
                          v-if="consent.isLoading"
                          class="animate-spin"
                        />
                      </span>
                    </li>
                  </ul>
                </div>

                <div class="max-w-xs flex justify-end gap-2" v-else>
                  <Popper
                    v-if="rowProps.row.status === OrderStatusEnum.completed"
                    arrow
                    offsetDistance="12"
                    content="Ver"
                    :hover="true"
                    placement="left"
                    class="tooltip"
                  >
                    <div
                      class="bg-gray-50 rounded-md py-2"
                      @click="openHistoryModal(rowProps.row.id)"
                    >
                      <SearchMdIcon
                        class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                      />
                    </div>
                  </Popper>

                  <Popper
                    v-if="rowProps.row.status === OrderStatusEnum.completed"
                    arrow
                    offsetDistance="12"
                    content="Imprimir"
                    :hover="true"
                    placement="left"
                    class="tooltip"
                  >
                    <div
                      class="bg-gray-50 rounded-md py-2"
                      @click="generatePrint(rowProps.row.id)"
                    >
                      <Loading01Icon
                        v-if="printingTicket === rowProps.row.id"
                        class="h-6 w-6 mx-2 cursor-pointer text-gray-600 animate-spin"
                      />
                      <PrinterIcon
                        v-else
                        class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                      />
                    </div>
                  </Popper>
                </div>
              </td>
            </template>
          </PaginatedTable>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="w-full p-5 mt-5 h-14 flex justify-end items-center bg-white">
      <DBtn @click="router.back()" class="bg-gray-300 hover:bg-gray-400"
        >Atrás</DBtn
      >
    </div>
  </div>

  <div
    v-show="modalIsOpen"
    class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative w-full h-full bg-white rounded-2xl p-5">
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
        @click="modalIsOpen = false"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div class="w-full h-full">
        <iframe
          ref="iframe"
          :src="selectedUrl"
          frameborder="0"
          class="w-full h-full"
          style="height: 80vh"
        ></iframe>
      </div>
    </div>
  </div>
</template>
