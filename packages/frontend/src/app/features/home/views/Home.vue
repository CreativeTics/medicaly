<script setup lang="ts">
import { onMounted } from 'vue'

// // metabase pass URiwy@8dxJvXW5H
// // apikey 3e7f4f192e235323ff14bb43cd096c6cda2371c44787a736254c86af60758d6b

const metaBaseUrl =
  'http://0.0.0.0:3000/embed/dashboard/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjF9LCJwYXJhbXMiOnt9LCJleHAiOjE2OTQxNzk4ODEsImlhdCI6MTY5MzU3OTg4MH0.ZTSKxggrX151C_sQL8uqfQbizBttm7uD3mru5niPlDQ#bordered=false&titled=false'

onMounted(() => {
  //   embedDashboardInit()

  setTimeout(() => {
    // window.location.reload()
  }, 3000)
})
</script>

<template>
  <div id="embed-dashboard">
    <iframe :src="metaBaseUrl" title="Dashboard"></iframe>
  </div>
</template>

<style>
#embed-dashboard {
  width: 100%;
  height: 100vh;
}

#embed-dashboard iframe {
  width: 100%;
  height: 100%;
}
</style>
