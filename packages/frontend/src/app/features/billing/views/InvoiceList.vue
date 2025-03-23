<script setup lang="ts">
import { ref, onMounted, reactive, defineAsyncComponent } from 'vue'
import { DBtn, DTextField, DSelectFieldSearch } from '@/app/components/basic'
const PaginatedTable = defineAsyncComponent(
  () => import('@/app/components/PaginatedTable.vue')
)

import Popper from 'vue3-popper'
import { useRouter } from 'vue-router'
import { getInvoices, Invoice } from '../services/invoices'

import dayjs from 'dayjs'
import SearchLgIcon from '@components/basic/icons/SearchLgIcon.vue'
import { getSubsidiariesList } from '../services'

const router = useRouter()

const actionsColumn = {
  key: 'actions',
  title: '',
}

const columns = [
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
  {
    key: 'totalAmount',
    title: 'Total',
    align: 'left',
  },
]

const subsidiaries = ref<{ id: any; name: any }[]>([])
const searchOptions = reactive<any>({
  subsidiaryId: '',
  startDate: dayjs().startOf('M').format('YYYY-MM-DD'),
  endDate: dayjs().endOf('M').format('YYYY-MM-DD'),
  contractName: '',
})

const data = ref<Invoice[]>([])

const search = async () => {
  data.value = await getInvoices()
}

const goToDetail = (invoiceId: string) => {
  router.push(`/billing/invoices/${invoiceId}`)
}

onMounted(async () => {
  subsidiaries.value = await getSubsidiariesList()
  data.value = await getInvoices()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">Facturas</p>
        <p class="text-gray-500 text-shadow">Lista de Facturas Creadas</p>
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
                  content="Ver Detalle"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToDetail(rowProps.row.id)"
                  >
                    <SearchLgIcon
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
</template>
