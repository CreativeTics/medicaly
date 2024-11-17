<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  SearchMdIcon,
  DBtn,
  DTextField,
  DSelectFieldSearch,
} from '@/app/components/basic'
import PaginatedTable from '@/app/components/PaginatedTable.vue'
import Popper from 'vue3-popper'
import { useRouter } from 'vue-router'
import { getList, getSubsidiariesList } from '../services'

import OrderStatus from '../../service-orders/components/OrderStatus.vue'
import ServiceStatus from '../../service-orders/components/ServiceStatus.vue'

const router = useRouter()

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
    key: 'services',
    title: 'Servicios',
  },
  {
    key: 'admittedAt',
    title: 'Fecha de Ingreso',
    align: 'left',
  },
]

const subsidiaries = ref<{ id: any; name: any }[]>([])
const searchOptions = reactive({
  subsidiary: '',
  orderCode: '',
  patient: '',
})
const data = ref<any>([])

const search = async () => {
  data.value = await getList(searchOptions)
}

const goToView = (id: string) => {
  router.push({ name: 'patient-attention.attention', params: { id } })
}

onMounted(async () => {
  subsidiaries.value = await getSubsidiariesList()
  searchOptions.subsidiary = localStorage.getItem('user-subsidiary') || ''
  data.value = await getList(searchOptions)
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">Atención de pacientes</p>
        <p class="text-gray-500 text-shadow">Ordedes pendientes de finalizar</p>
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
                v-model="searchOptions.subsidiary"
                :options="subsidiaries"
                @search="search"
                class="min-w-fit w-96"
              />

              <DTextField
                label="# de orden"
                placeholder="Digite el numero de orden"
                :icon="'SearchLgIcon'"
                class="min-w-fit w-96"
                v-model="searchOptions.orderCode"
                @keyup.enter="search"
              />
              <DTextField
                label="Paciente"
                placeholder="Digite el nombre o documento del paciente"
                :icon="'SearchLgIcon'"
                class="min-w-fit w-full"
                v-model="searchOptions.patient"
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
                v-if="
                  column.key !== 'actions' &&
                  column.key !== 'status' &&
                  column.key !== 'services'
                "
              >
                {{ rowProps.row[column.key] }}
              </div>

              <OrderStatus
                v-else-if="column.key === 'status'"
                :status="rowProps.row[column.key]"
              />

              <div v-else-if="column.key === 'services'">
                <div
                  v-for="service in rowProps.row[column.key]"
                  :key="service.id"
                >
                  <ServiceStatus
                    :status="service.status"
                    :text="service.name"
                  />
                </div>
              </div>

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Ver detalle"
                  :hover="true"
                  placement="left"
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
              </div>
            </td>
          </template>
        </PaginatedTable>
      </div>
    </div>
  </div>
</template>
