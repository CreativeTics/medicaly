<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
import { DBtn, DTextField } from '@/app/components/basic'
import { FileSearch01Icon } from '@/app/components/basic/icons'
import Popper from 'vue3-popper'

const PaginatedTable = defineAsyncComponent(
  () => import('@components/PaginatedTable.vue'),
)

import { listCatalogs } from '../services'
import type { Catalog } from '../services'

const router = useRouter()
const notifications = useNotificationsStore()

const columns = [
  { key: 'catalogKey', title: 'Clave', align: 'left' },
  { key: 'description', title: 'Descripción', align: 'left' },
  { key: 'latestVersion', title: 'Versión', align: 'left' },
  { key: 'codingSystemReferenceUrl', title: 'Referencia', align: 'left' },
]

const actionsColumn = { key: 'actions', title: '' }

const data = ref<Catalog[]>([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = 25
const searchText = ref('')
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const result = await listCatalogs({
      page: currentPage.value,
      size: perPage,
      q: searchText.value || undefined,
    })
    data.value = result.rows
    totalRows.value = result.total
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo cargar la lista de catálogos',
    })
  } finally {
    loading.value = false
  }
}

const onPageChange = async (page: number) => {
  currentPage.value = page
  await loadData()
}

const onSearch = async () => {
  currentPage.value = 1
  await loadData()
}

const goToItems = (catalogKey: string) => {
  router.push({ name: 'catalogs.items', params: { catalogKey } })
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">Catálogos de Referencia</p>
        <p class="text-gray-500 text-shadow">
          Catálogos estandarizados de datos de referencia (solo lectura)
        </p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="[...columns, actionsColumn]"
          :rows="data"
          :server-side="true"
          :total-rows="totalRows"
          :per-page="perPage"
          style="height: calc(100vh - 200px)"
          @page-change="onPageChange"
        >
          <template #header>
            <div class="py-3 flex items-center gap-2">
              <DTextField
                v-model="searchText"
                placeholder="Buscar catálogos..."
                class="w-80"
                @keyup.enter="onSearch"
              />
              <DBtn size="sm" @click="onSearch">Buscar</DBtn>
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
                v-if="column.key === 'codingSystemReferenceUrl'"
                class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
              >
                <a
                  :href="rowProps.row[column.key]"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  {{ rowProps.row[column.key] }}
                </a>
              </div>

              <div
                v-else-if="column.key !== 'actions'"
                class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {{ rowProps.row[column.key] }}
              </div>

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Ver elementos"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToItems(rowProps.row.catalogKey)"
                  >
                    <FileSearch01Icon
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
