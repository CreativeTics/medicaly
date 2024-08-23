<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMetabaseDashboardUrl } from '../services'
import { useRoute } from 'vue-router'

const dashboardUrl = ref<string | null>(null)

const route = useRoute()

onMounted(async () => {
  if (route.params.id) {
    const reportId = parseInt(route.params.id.toString())
    dashboardUrl.value = await getMetabaseDashboardUrl(reportId)
  }
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
