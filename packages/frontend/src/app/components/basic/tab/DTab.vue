<script setup lang="ts">
defineProps({
  title: String,
  selectedTitle: String,
});
</script>
<template>
  <div class="tabs__content" v-show="title == selectedTitle">
    <slot></slot>
  </div>
</template>
