<template>
  <component :is="template">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const template = computed(() => `${route.meta.layout || "login"}-layout`);
</script>
