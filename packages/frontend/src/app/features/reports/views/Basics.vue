<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMetabaseDashboardUrl } from '../services'

const dashboardUrl = ref<string | null>(null)

onMounted(async () => {
  dashboardUrl.value = await getMetabaseDashboardUrl(2)
})
</script>

<template>
  <div v-if="dashboardUrl">
    <iframe
      :src="dashboardUrl"
      width="100%"
      class="h-screen"
      frameborder="0"
    ></iframe>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
