<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
)
const DeleteConfirmModal = defineAsyncComponent(
  () => import('@components/DeleteConfirmModal.vue')
)
import { getList, deleteRecord } from '../services'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const notifications = useNotificationsStore()
const moduleName = 'Contrato'
const modulePath = 'contracts'

const columns = [
  {
    key: 'documentNumber',
    title: 'No. Documento',
  },
  {
    key: 'name',
    title: 'Nombre',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'phone',
    title: 'Telefono',
  },
  {
    key: 'status',
    title: 'Estado',
  },
  {
    key: 'updatedAt',
    title: 'Ultima modificación',
  },
]

const data = ref<any>([])

const actions = ref([
  ...(useAuthStore().user?.role.permissions.includes('contracts:full')
    ? ['create', 'edit', 'delete']
    : ['view']),
])

const goToCreate = () => {
  router.push({ name: `${modulePath}.create` })
}
const goToEdit = (id: string) => {
  router.push({ name: `${modulePath}.edit`, params: { id } })
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
    await deleteRecord(recordToDelete.value.id)
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} eliminado`,
      text: `"${recordToDelete.value.name}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    data.value = await getList()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se pudo eliminar el ${moduleName.toLowerCase()}`,
    })
  }
}

onMounted(async () => {
  data.value = await getList()
})
</script>

<template>
  <ModuleListBasic
    :title="`${moduleName}s`"
    :subtitle="`Gestión de ${moduleName}s`"
    :columns="columns"
    :rows="data"
    :actions="actions"
    @edit="goToEdit"
    @view="goToEdit"
    @create="goToCreate"
    @delete="openDeleteModal"
  />

  <DeleteConfirmModal
    v-if="showDeleteModal"
    :title="`Eliminar ${moduleName}`"
    :record-name="recordToDelete?.name"
    :label="`nombre del ${moduleName.toLowerCase()}`"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
