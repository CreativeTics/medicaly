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
import { getRoles, deleteRecord } from '../services'

const router = useRouter()
const notifications = useNotificationsStore()

const columns = [
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'description',
    title: 'Descripción',
    align: 'left',
  },
  {
    key: 'permissions',
    title: 'Permisos',
    align: 'left',
  },
  {
    key: 'updatedAt',
    title: 'Ultima modificación',
    align: 'left',
  },
]

const data = ref<any>([])

const goToCreate = () => {
  router.push({ name: 'roles.create' })
}
const goToEdit = (id: string) => {
  router.push({ name: 'roles.edit', params: { id } })
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
      title: 'Rol eliminado',
      text: `"${recordToDelete.value.name}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    data.value = await getRoles()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el rol',
    })
  }
}

onMounted(async () => {
  data.value = await getRoles()
})
</script>

<template>
  <ModuleListBasic
    title="Roles"
    subtitle="Gestión de Roles"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
    @delete="openDeleteModal"
  />

  <DeleteConfirmModal
    v-if="showDeleteModal"
    title="Eliminar Rol"
    :record-name="recordToDelete?.name"
    label="nombre del rol"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
