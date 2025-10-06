<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getSessions, deleteSession } from '../services'
import DBtn from '@components/basic/DBtn.vue'
import { DTextField } from '@components/basic'
import DConfirmationModal from '@components/basic/DConfirmationModal.vue'

const sessions = ref<
  { token: string; userId: string; username: string; lastUsage: Date }[]
>([])

const search = ref('')

const showDeleteSessionModal = ref(false)
const sessionToDelete = ref<string | null>(null)

const filteredSessions = computed(() => {
  return sessions.value.filter((session) =>
    session.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const loadSessions = async () => {
  sessions.value = await getSessions()
}

let intervalNumber = 0

onMounted(async () => {
  intervalNumber = setInterval(loadSessions, 10000)
  await loadSessions()
})

onUnmounted(() => {
  clearInterval(intervalNumber)
})

const handleDeleteSession = async () => {
  console.log('handleDeleteSession', sessionToDelete.value)
  try {
    if (sessionToDelete.value) await deleteSession(sessionToDelete.value)
  } catch (error) {
    console.error('Error deleting session', error)
  }
  showDeleteSessionModal.value = false
  await loadSessions()
}
</script>

<template>
  <h1>Sesiones activas : {{ sessions.length }}</h1>

  <DTextField
    v-model="search"
    placeholder="Buscar usuario..."
    class="mb-4"
    icon="SearchLgIcon"
  />

  <ul class="mt-4 h-full overflow-y-auto">
    <li
      v-for="session in filteredSessions"
      :key="session.token"
      class="py-2 bg-white px-4 rounded shadow mb-2"
    >
      <div class="flex justify-between items-center">
        <div>
          <p><strong>User ID:</strong> {{ session.userId }}</p>
          <p><strong>Username:</strong> {{ session.username }}</p>
          <p>
            <strong>Last Usage:</strong>
            {{ new Date(session.lastUsage).toLocaleString() }}
          </p>
        </div>
        <DBtn
          class="bg-red-500 text-white"
          @click="
            ;(sessionToDelete = session.token), (showDeleteSessionModal = true)
          "
          >Eliminar</DBtn
        >
      </div>
    </li>
  </ul>
  <DConfirmationModal
    v-if="showDeleteSessionModal"
    title="Eliminar Sesión"
    message="¿Está seguro de que desea eliminar esta sesión, el usuario deberá volver a iniciar sesión?"
    bottomColor="danger"
    @close="showDeleteSessionModal = false"
    @confirm="handleDeleteSession"
  />
</template>
