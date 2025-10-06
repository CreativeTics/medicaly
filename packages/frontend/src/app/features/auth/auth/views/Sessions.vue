<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getSessions } from '../services'

const sessions = ref<
  { token: string; userId: string; username: string; lastUsage: Date }[]
>([])

const loadSessions = async () => {
  sessions.value = await getSessions()
}

let intervalNumber = 0

onMounted(async () => {
  intervalNumber = setInterval(loadSessions, 10000)
})

onUnmounted(() => {
  clearInterval(intervalNumber)
})
</script>

<template>
  <h1>Sesiones activas</h1>

  <ul>
    <li
      v-for="session in sessions"
      :key="session.token"
      class="border-b border-gray-200 py-2"
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
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          @click=""
        >
          Eliminar
        </button>
      </div>
    </li>
  </ul>
</template>
