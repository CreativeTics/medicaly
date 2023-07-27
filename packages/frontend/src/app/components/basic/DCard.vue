<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string
    description: string
    header: boolean
    footer: boolean
  }>(),
  {
    title: '',
    description: '',
    header: false,
    footer: false
  }
)
</script>
<template>
  <div
    class="flex flex-col justify-between border-2 sm:w-full rounded-lg bg-white h-auto min-h-0">
    <header class="bg-gray-100 py-3 rounded-t-lg px-5" v-if="header">
      <slot name="header"></slot>
    </header>
    <main class="px-5 flex flex-col gap-3 py-5">
      <h1 v-if="title">
        {{ title }}
      </h1>
      <p v-if="description">
        {{ description }}
      </p>
      <slot></slot>
    </main>
    <footer class="bg-gray-50 py-3 rounded-b-lg px-5" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
<style>
footer {
  border-top: 1px solid #d8d8d8;
}

header {
  border-bottom: 1px solid #d8d8d8;
}
</style>
