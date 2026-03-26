<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
import { DBtn, DTextField } from '@components/basic'
import { XIcon } from '@components/basic/icons'

const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
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

// Delete confirmation
const showDeleteModal = ref(false)
const examToDelete = ref<any>(null)
const confirmationText = ref('')

const canConfirmDelete = computed(() => {
  return (
    examToDelete.value &&
    confirmationText.value === examToDelete.value.name
  )
})

const openDeleteModal = (row: any) => {
  examToDelete.value = row
  confirmationText.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  examToDelete.value = null
  confirmationText.value = ''
}

const confirmDelete = async () => {
  if (!canConfirmDelete.value) return

  try {
    await deleteExam(examToDelete.value.id)
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} eliminado`,
      text: `El examen "${examToDelete.value.name}" se ha eliminado correctamente`,
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

  <!-- Modal de confirmación para eliminar -->
  <div
    v-if="showDeleteModal"
    class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative w-full sm:w-1/2 md:w-1/3 bg-white rounded-2xl p-5">
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
        @click="closeDeleteModal"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div class="w-full h-full flex flex-col items-stretch justify-center gap-2">
        <span class="text-lg text-center font-semibold">Eliminar Examen</span>
        <hr class="divide-x-2" />
        <div class="text-sm text-center text-gray-500">
          Esta acción no se puede deshacer. Para confirmar, escriba el nombre
          del examen:
        </div>
        <div class="text-sm text-center font-semibold text-red-600 py-1">
          {{ examToDelete?.name }}
        </div>
        <DTextField
          v-model="confirmationText"
          label=""
          placeholder="Escriba el nombre del examen"
          id="confirmExamName"
          :error="
            confirmationText.length > 0 && !canConfirmDelete
              ? 'El nombre no coincide'
              : ''
          "
        />
        <div class="flex w-full justify-end mt-4 gap-2">
          <DBtn @click="closeDeleteModal" class="bg-gray-300 hover:bg-gray-400">
            Cancelar
          </DBtn>
          <DBtn
            @click="confirmDelete"
            class="text-white"
            color="danger"
            :disabled="!canConfirmDelete"
          >
            Eliminar
          </DBtn>
        </div>
      </div>
    </div>
  </div>
</template>
