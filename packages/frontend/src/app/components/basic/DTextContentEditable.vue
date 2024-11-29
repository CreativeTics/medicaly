<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: '',
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const emitUpdate = (event: Event) => {
  const val = (event.target as HTMLInputElement).innerText ?? ''

  emit('update:modelValue', val.replace('\n', ' '))
}
</script>

<template>
  <span
    contenteditable
    class="w-full border border-dotted rounded-lg"
    style="min-width: 20px"
    @input="emitUpdate($event)"
    >{{ modelValue }}</span
  >
</template>
