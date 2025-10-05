<script setup lang="ts">
import { DBtn, DSelectFieldSearch, DTextField } from '@/app/components/basic'
import { Edit03Icon, SearchMdIcon } from '@components/basic/icons'
import {
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'
import Popper from 'vue3-popper'
import { getContracts, getList } from '../services'
const PaginatedTable = defineAsyncComponent(
  () => import('@/app/components/PaginatedTable.vue')
)

import { useAuthStore } from '@/store/auth'
import OrderStatus from '../components/OrderStatus.vue'
// import { useAuthStore } from '@/store/auth'

const router = useRouter()
const modulePath = 'service-orders'

// const user = useAuthStore().user

const actionsColumn = {
  key: 'actions',
  title: '',
}

const columns = [
  {
    key: 'code',
    title: '# Orden',
    align: 'left',
  },
  {
    key: 'type',
    title: 'Tipo',
    align: 'left',
  },
  {
    key: 'patientName',
    title: 'Paciente',
    align: 'left',
  },
  {
    key: 'status',
    title: 'Estado de atención',
  },

  {
    key: 'updatedAt',
    title: 'Ultima modificación',
    align: 'left',
  },
]

const contractList = ref<{ id: any; name: any }[]>([])
const searchOptions = reactive({
  contract: '',
  orderCode: '',
  patient: '',
})
const data = ref<any>([])

const search = async () => {
  data.value = await getList(searchOptions)
}

const goToCreate = () => {
  console.log('Create')
  router.push({ name: `${modulePath}.create` })
}

const goToView = (id: string) => {
  router.push({ name: `${modulePath}.view`, params: { id } })
}
const goToEdit = (id: string) => {
  router.push({ name: `${modulePath}.edit`, params: { id } })
}

let interval: number = 0

onMounted(async () => {
  contractList.value = await getContracts()
  data.value = await getList(searchOptions)

  interval = setInterval(async () => {
    data.value = await getList(searchOptions)
  }, 500)
})

onBeforeUnmount(() => {
  data.value = []
  contractList.value = []
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">Ordenes de servicio</p>
        <p class="text-gray-500 text-shadow">Gestión de Ordenes de servicio</p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="[...columns, actionsColumn]"
          :rows="data"
          style="height: calc(100vh - 200px)"
        >
          <template #header>
            <div class="py-3 flex items-end sm:mb-0 sm:w-3/4 md:w-3/4">
              <DSelectFieldSearch
                label="Contrato:"
                v-model="searchOptions.contract"
                :options="contractList"
                @search="search"
                class="mr-2 w-full"
              />

              <DTextField
                label="# de orden"
                placeholder="Digite el numero de orden"
                :icon="'SearchLgIcon'"
                class="mr-2 w-full"
                v-model="searchOptions.orderCode"
                @keyup.enter="search"
              />
              <DTextField
                label="Paciente"
                placeholder="Digite el nombre o documento del paciente"
                :icon="'SearchLgIcon'"
                class="mr-2 w-full"
                v-model="searchOptions.patient"
                @keyup.enter="search"
              />
              <DBtn class="h-10 w-20" @click.prevent="search">Buscar</DBtn>
            </div>
            <div class="py-3">
              <DBtn @click.prevent="goToCreate">Crear Ordenes</DBtn>
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
                  content="Ver detalle"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToView(rowProps.row.id)"
                  >
                    <SearchMdIcon
                      class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                    />
                  </div>
                </Popper>
                <Popper
                  v-if="
                    useAuthStore().user?.role?.permissions?.includes(
                      'service-orders:full'
                    )
                  "
                  arrow
                  offsetDistance="12"
                  content="Editar"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToEdit(rowProps.row.id)"
                  >
                    <Edit03Icon
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

attendance patient ingress
