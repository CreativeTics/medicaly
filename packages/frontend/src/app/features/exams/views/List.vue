<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
import { DBtn, DTextField, DSelectFieldSearch } from '@/app/components/basic'
import {
  Copy01Icon,
  Edit03Icon,
  Trash01Icon,
} from '@/app/components/basic/icons'
import Popper from 'vue3-popper'

const PaginatedTable = defineAsyncComponent(
  () => import('@components/PaginatedTable.vue'),
)
const DeleteConfirmModal = defineAsyncComponent(
  () => import('@components/DeleteConfirmModal.vue'),
)
import { getList, deleteExam, getExamTypes } from '../services'

const router = useRouter()
const notifications = useNotificationsStore()
const moduleName = 'Examen'
const modulePath = 'exams'

const actionsColumn = { key: 'actions', title: '' }

const columns = [
  { key: 'type', title: 'Tipo', align: 'left' },
  { key: 'code', title: 'Codigo', align: 'left' },
  { key: 'name', title: 'Nombre', align: 'left' },
  { key: 'version', title: 'Version', align: 'left' },
  { key: 'updatedAt', title: 'Ultima modificación', align: 'left' },
]

const examTypesList = ref<{ code: string; name: string }[]>([])
const selectedType = ref('')
const searchText = ref('')
const data = ref<any[]>([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = 10

const examTypeBadge: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  EXAM: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Examen' },
  PARACLINIC: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Paraclínico',
  },
  LABORATORY: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    label: 'Laboratorio',
  },
}

const getBadge = (type: string) => {
  return (
    examTypeBadge[type] ?? {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: type,
    }
  )
}

const loadData = async () => {
  const result = await getList({
    type: selectedType.value || undefined,
    searchText: searchText.value || undefined,
    page: currentPage.value,
    perPage,
  })
  data.value = result.rows
  totalRows.value = result.total
}

const onTypeChange = async (value: string) => {
  selectedType.value = value
  currentPage.value = 1
  await loadData()
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
const goToCopy = (id: string) => {
  router.push({ name: `${modulePath}.create`, query: { copyFrom: id } })
}

// Delete
const showDeleteModal = ref(false)
const recordToDelete = ref<any>(null)

const openDeleteModal = (row: any) => {
  recordToDelete.value = row
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  recordToDelete.value = null
}

const confirmDelete = async () => {
  try {
    await deleteExam(recordToDelete.value.id)
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} eliminado`,
      text: `El examen "${recordToDelete.value.name}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    await loadData()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se pudo eliminar el examen`,
    })
  }
}

onMounted(async () => {
  examTypesList.value = await getExamTypes()
  await loadData()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">{{ moduleName }}es</p>
        <p class="text-gray-500 text-shadow">Gestión de {{ moduleName }}es</p>
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
            <div class="py-3 flex items-end sm:mb-0 sm:w-3/4 md:w-3/4">
              <DTextField
                placeholder="Buscar..."
                :icon="'SearchLgIcon'"
                class="mr-2 w-full"
                v-model="searchText"
                @keyup.enter="onSearch"
              />
              <DSelectFieldSearch
                label="Tipo:"
                v-model="selectedType"
                :options="examTypesList"
                valueKey="code"
                showKey="name"
                placeholder="Todos"
                class="mr-2 w-full"
                @change="onTypeChange"
              />
              <DBtn class="h-10 w-24" @click.prevent="onSearch">Buscar</DBtn>
            </div>
            <div class="py-3">
              <DBtn @click.prevent="goToCreate">Crear Nuevo</DBtn>
            </div>
          </template>

          <template #row="rowProps">
            <td
              v-for="column in rowProps.columns"
              v-bind:key="column.key"
              class="px-3 bg-white"
              :class="column.key === 'actions' ? 'sticky right-0' : ''"
            >
              <!-- Badge para columna tipo -->
              <div v-if="column.key === 'type'" class="max-w-xs">
                <span
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="[
                    getBadge(rowProps.row.type).bg,
                    getBadge(rowProps.row.type).text,
                  ]"
                >
                  {{ getBadge(rowProps.row.type).label }}
                </span>
              </div>

              <!-- Columnas normales -->
              <div
                v-else-if="column.key !== 'actions'"
                class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {{ rowProps.row[column.key] }}
              </div>

              <!-- Acciones -->
              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Duplicar"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToCopy(rowProps.row.id)"
                  >
                    <Copy01Icon
                      class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                    />
                  </div>
                </Popper>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Editar"
                  :hover="true"
                  placement="left"
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
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Eliminar"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="openDeleteModal(rowProps.row)"
                  >
                    <Trash01Icon
                      class="h-6 w-6 mx-2 cursor-pointer text-red-600"
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

  <DeleteConfirmModal
    v-if="showDeleteModal"
    :title="`Eliminar ${moduleName}`"
    :record-name="recordToDelete?.name"
    :label="`nombre del ${moduleName.toLowerCase()}`"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
