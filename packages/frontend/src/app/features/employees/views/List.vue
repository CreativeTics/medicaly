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

const router = useRouter()
const notifications = useNotificationsStore()

const columns = [
  {
    key: 'documentNumber',
    title: 'No. Documento',
    align: 'left',
  },
  {
    key: 'fullName',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'position',
    title: 'Cargo',
  },
  {
    key: 'user',
    title: 'Usuario',
  },
  {
    key: 'updatedAt',
    title: 'Ultima modificación',
    align: 'left',
  },
]

const data = ref<any>([])

const goToCreate = () => {
  router.push({ name: 'employees.create' })
}
const goToEdit = (id: string) => {
  router.push({ name: 'employees.edit', params: { id } })
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
      title: 'Empleado eliminado',
      text: `"${recordToDelete.value.fullName}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    data.value = await getList()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el empleado',
    })
  }
}

onMounted(async () => {
  data.value = await getList()
})
</script>

<template>
  <ModuleListBasic
    title="Empleados"
    subtitle="Gestión de Empleados"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
    @delete="openDeleteModal"
  />

  <DeleteConfirmModal
    v-if="showDeleteModal"
    title="Eliminar Empleado"
    :record-name="recordToDelete?.fullName"
    label="nombre del empleado"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
