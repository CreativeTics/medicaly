<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getOrdersForPatient,
  PatientOrder,
  Patient,
  getPatientById,
  getPrintUrl,
} from '../services'
// import { finalizeOrder } from '../services/services'
import DBtn from '@components/basic/DBtn.vue'
import OrderStatus from '@features/service-orders/components/OrderStatus.vue'
import Popper from 'vue3-popper'
import PaginatedTable from '@components/PaginatedTable.vue'
import PatientHeader from '../components/PatientHeader.vue'
import SearchMdIcon from '@components/basic/icons/SearchMdIcon.vue'
import PrinterIcon from '@components/basic/icons/PrinterIcon.vue'

const route = useRoute()
const router = useRouter()

// const notifications = useNotificationsStore()

const loading = ref(false)
const patient = ref<Patient>()

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
    key: 'createdAt',
    title: 'Fecha de Admisión',
    align: 'left',
  },
  {
    key: 'updatedAt',
    title: 'Fecha de Salida',
    align: 'left',
  },
  {
    key: 'actions',
    title: '',
  },
]

const data = ref<PatientOrder[]>([])

const generatePrint = async (code: string) => {
  console.log('Generate preview')
  const url = await getPrintUrl(code, 'b79264275ddd22421f37df9854018a75')
  window.open(url, '_blank')
}

onMounted(async () => {
  if (route.params.id) {
    patient.value = await getPatientById(route.params.id.toString())
    loading.value = true
    data.value = await getOrdersForPatient(route.params.id.toString())
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <div class="leading-4 pt-responsive">
      <p class="text-3xl font-semibold text-shadow">Historia - paciente</p>
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
                  v-if="column.key !== 'actions' && column.key !== 'status'"
                >
                  {{ rowProps.row[column.key] }}
                </div>

                <div class="max-w-xs gap-2" v-else-if="column.key === 'status'">
                  <OrderStatus :status="rowProps.row.status" />
                </div>

                <div class="max-w-xs flex justify-end gap-2" v-else>
                  <!-- <Popper
                    arrow
                    offsetDistance="12"
                    content="Ver"
                    :hover="true"
                    placement="left"
                    class="tooltip"
                  >
                    <div class="bg-gray-50 rounded-md py-2" @click="">
                      <SearchMdIcon
                        class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                      />
                    </div>
                  </Popper> -->

                  <Popper
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
                      <PrinterIcon
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
</template>
