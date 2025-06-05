<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Editar',
  }
)

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const emitUpdate = (event: Event) => {
  const val = (event.target as HTMLInputElement).innerText ?? ''

  emit('update:modelValue', val.replace('\n', ' '))
}

import { ref } from 'vue'
const editable = ref<HTMLElement | null>(null)

const showingText = ref(props.modelValue || props.placeholder)

function handleFocus() {
  if (editable.value?.innerText === props.placeholder) {
    showingText.value = ''
  }
}

function handleBlur() {
  if (editable.value?.innerText.trim() === '') {
    showingText.value = props.placeholder
  }
}
</script>

<template>
  <span
    ref="editable"
    contenteditable
    class="w-full border border-dotted rounded-lg focus:outline-blue-500 p-1 min-w-min"
    style="min-width: 20px"
    @input="emitUpdate($event)"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    {{ showingText }}
  </span>
</template>
