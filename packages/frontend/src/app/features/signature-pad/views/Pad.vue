<script setup lang="ts">
import { useRoute } from "vue-router"
import SignaturePad from "@/app/components/biometric/DSignaturePad.vue"
const route = useRoute()
</script>

<template>
  <SignaturePad :code="route.params.code" />
</template>
