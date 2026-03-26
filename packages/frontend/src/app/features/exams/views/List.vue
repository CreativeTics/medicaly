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
import { getList, deleteExam } from '../services'

const router = useRouter()
const notifications = useNotificationsStore()
const moduleName = 'Examen'
const modulePath = 'exams'

const columns = [
  { key: 'type', title: 'Tipo', align: 'left' },
  { key: 'code', title: 'Codigo', align: 'left' },
  { key: 'name', title: 'Nombre', align: 'left' },
  { key: 'version', title: 'Version', align: 'left' },
  { key: 'updatedAt', title: 'Ultima modificación', align: 'left' },
]

const data = ref<any>([])

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
    await deleteExam(recordToDelete.value.code)
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} eliminado`,
      text: `El examen "${recordToDelete.value.name}" se ha eliminado correctamente`,
    })
    closeDeleteModal()
    data.value = await getList()
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se pudo eliminar el examen`,
    })
  }
}

onMounted(async () => {
  data.value = await getList()
})
</script>

<template>
  <ModuleListBasic
    :title="`${moduleName}es`"
    :subtitle="`Gestión de ${moduleName}es`"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'copy', 'delete', 'create']"
    @edit="goToEdit"
    @copy="goToCopy"
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
