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
import { getUsers, remove } from '../services'

const router = useRouter()
const notifications = useNotificationsStore()

const columns = [
  {
    key: 'type',
    title: 'Tipo',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'username',
    title: 'Usuario',
    align: 'left',
  },
  {
    key: 'roleName',
    title: 'Rol',
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
  router.push({ name: 'users.create' })
}
const goToEdit = (id: string) => {
  router.push({ name: 'users.edit', params: { id } })
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
    await remove(recordToDelete.value.id)
    notifications.addNotification({
      type: 'success',
      title: 'Usuario eliminado',
      text: `"${recordToDelete.value.name}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    data.value = await getUsers()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el usuario',
    })
  }
}

onMounted(async () => {
  data.value = await getUsers()
})
</script>

<template>
  <ModuleListBasic
    title="Usuarios"
    subtitle="Gestión de usuarios del sistema"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
    @delete="openDeleteModal"
  />

  <DeleteConfirmModal
    v-if="showDeleteModal"
    title="Eliminar Usuario"
    :record-name="recordToDelete?.name"
    label="nombre del usuario"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
