<script setup>
const props = defineProps({
  nameItem: { type: String, default: 'Prueba item' }
})

defineEmits(['clicked'])
</script>

<template>
  <div
    class="w-full h-11 bg-gray-50 flex justify-between items-center px-3 cursor-pointer rounded-lg mr-5 hover:bg-gray-200 my-2"
    @click="$emit('clicked')">
    <p class="font-semibold text-justify text-gray-500 w-full truncate ...">
      {{ nameItem }}
    </p>
  </div>
</template>
