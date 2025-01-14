<!-- __previewjs__/Wrapper.vue -->

<script setup>
import '../src/styles.css'
import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()
appContext.app.use(mockRouter)
</script>
<template>
  <div class="wrapper">
    <slot />
  </div>
</template>
