<script setup lang="ts">
import { ref, onMounted, reactive, defineAsyncComponent } from 'vue'
import Popper from 'vue3-popper'
import dayjs from 'dayjs'

import { DBtn, DTextField, DSelectFieldSearch } from '@/app/components/basic'
const PaginatedTable = defineAsyncComponent(
  () => import('@/app/components/PaginatedTable.vue')
)

import { getInvoices, Invoice } from '../../billing/services/invoices'
import { getSubsidiariesList } from '../../billing/services'
import { getRipsReport } from '../services'
import { XlsxIcon, JsonIcon } from '@components/basic/'

const actionsColumn = {
  key: 'actions',
  title: '',
}

const columns = [
  {
    key: 'createdAt',
    title: 'Fecha de Registro',
    align: 'left',
  },
  {
    key: 'invoiceNumber',
    title: 'N° Factura',
    align: 'left',
  },
  {
    key: 'subsidiaryName',
    title: 'Sede',
    align: 'left',
  },
  {
    key: 'contractName',
    title: 'Contrato',
    align: 'left',
  },
  {
    key: 'range',
    title: 'Rango',
    align: 'left',
  },
  {
    key: 'totalOrders',
    title: 'Cant. Ordenes',
    align: 'left',
  },
]

const subsidiaries = ref<{ id: any; name: any }[]>([])
const searchOptions = reactive({
  subsidiaryId: '',
  startDate: dayjs().startOf('M').format('YYYY-MM-DD'),
  endDate: dayjs().endOf('M').format('YYYY-MM-DD'),
  contractName: '',
})

const data = ref<Invoice[]>([])

const search = async () => {
  data.value = await getInvoices(searchOptions)
}

const downloadRipsReport = async (
  id: string,
  invoiceNumber: string,
  format: 'xlsx' | 'json'
) => {
  await getRipsReport(id, invoiceNumber, format)
}

onMounted(async () => {
  subsidiaries.value = await getSubsidiariesList()
  data.value = await getInvoices(searchOptions)
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">RIPS</p>
        <p class="text-gray-500 text-shadow">
          Lista de Facturas disponibles para descargar el reporte de Rips
        </p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="[...columns, actionsColumn]"
          :rows="data"
          style="height: calc(100vh - 200px)"
        >
          <template #header>
            <div class="py-3 w-full flex flex-row gap-5 items-end">
              <DSelectFieldSearch
                label="Sede:"
                v-model="searchOptions.subsidiaryId"
                :options="subsidiaries"
                @search="search"
                class="min-w-fit w-96"
              />

              <DTextField
                label="Desde"
                type="date"
                class="min-w-fit w-96"
                v-model="searchOptions.startDate"
                @keyup.enter="search"
              />
              <DTextField
                label="Hasta"
                type="date"
                class="min-w-fit w-96"
                v-model="searchOptions.endDate"
                @keyup.enter="search"
              />
              <DTextField
                label="Contrato"
                placeholder="Digite el nombre o documento del contrato"
                :icon="'SearchLgIcon'"
                class="min-w-fit w-full"
                v-model="searchOptions.contractName"
                @keyup.enter="search"
              />
              <DBtn class="h-10 w-20" @click.prevent="search">Buscar</DBtn>
            </div>
          </template>

          <template #row="rowProps">
            <td
              v-for="column in rowProps.columns"
              v-bind:key="column.key"
              class="px-3 bg-white"
              :class="column.key === 'actions' ? 'sticky right-0' : ''"
            >
              <div
                class="w-full"
                v-if="column.key !== 'actions' && column.key !== 'status'"
              >
                {{ rowProps.row[column.key] }}
              </div>

              <OrderStatus
                v-else-if="column.key === 'status'"
                :status="rowProps.row[column.key]"
              />

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Descargar Excel"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2 cursor-pointer hover:scale-110"
                    @click="
                      downloadRipsReport(
                        rowProps.row.id,
                        rowProps.row.invoiceNumber,
                        'xlsx'
                      )
                    "
                  >
                    <XlsxIcon class="h-4 w-4 mx-2 text-gray-600" />
                  </div>
                </Popper>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Descargar JSON"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2 cursor-pointer hover:scale-110"
                    @click="
                      downloadRipsReport(
                        rowProps.row.id,
                        rowProps.row.invoiceNumber,
                        'json'
                      )
                    "
                  >
                    <JsonIcon class="h-4 w-4 mx-2 text-gray-600" />
                  </div>
                </Popper>
              </div>
            </td>
          </template>
        </PaginatedTable>
      </div>
    </div>
  </div>
</template>
