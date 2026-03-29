<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import { getList } from '../services'
import DTextField from '@components/basic/DTextField.vue'
import Popper from 'vue3-popper'
import { Edit03Icon } from '@components/basic/icons'
import { DBtn } from '@components/basic'

const PaginatedTable = defineAsyncComponent(
  () => import('@components/PaginatedTable.vue')
)

const router = useRouter()
const modulePath = 'cie10'

const columns = [
  {
    key: 'code',
    title: 'Código',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'parentCode',
    title: 'Grupo Padre',
    align: 'left',
  },
]

const data = ref<any[]>([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = 10
const searchText = ref('')

const loadData = async () => {
  const result = await getList({
    searchText: searchText.value || undefined,
    page: currentPage.value,
    perPage,
  })
  data.value = result.rows
  totalRows.value = result.total
}

const onSearch = async () => {
  currentPage.value = 1
  await loadData()
}

const onPageChange = async (page: number) => {
  currentPage.value = page
  await loadData()
}

const goToCreate = () => {
  router.push({ name: `${modulePath}.create` })
}
const goToEdit = (id: string) => {
  router.push({ name: `${modulePath}.edit`, params: { id } })
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">CIE10</p>
        <p class="text-gray-500 text-shadow">
          Gestión de códigos de diagnostico
        </p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="columns"
          :rows="data"
          :server-side="true"
          :total-rows="totalRows"
          :per-page="perPage"
          style="height: calc(100vh - 200px)"
          @page-change="onPageChange"
        >
          <template #header>
            <div class="py-3 flex items-end sm:mb-0 sm:w-3/4 md:w-3/4">
              <DTextField
                label=""
                placeholder="Digite el codigo o nombre a buscar"
                :icon="'SearchLgIcon'"
                class="mr-2 w-full"
                v-model="searchText"
                @keyup.enter="onSearch"
              />

              <DBtn class="h-10 w-20" @click.prevent="onSearch">Buscar</DBtn>
            </div>
            <div class="py-3">
              <DBtn @click.prevent="goToCreate">Crear nuevo</DBtn>
            </div>
          </template>

          <template #row="rowProps">
            <td
              v-for="column in rowProps.columns"
              v-bind:key="column.key"
              class="px-3 bg-white"
              :class="column.key === 'actions' ? 'sticky right-0' : ''"
            >
              <div class="w-full" v-if="column.key !== 'actions'">
                {{ rowProps.row[column.key] }}
              </div>

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Editar"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                  @click="goToEdit(rowProps.row.id)"
                >
                  <div class="bg-gray-50 rounded-md py-2">
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
