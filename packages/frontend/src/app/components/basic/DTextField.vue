<script setup lang="ts">
import { onMounted } from 'vue'
import DIcon from './DIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | Array<string | number>
    label?: string
    placeholder?: string
    hint?: string
    type?: string
    disabled?: boolean
    hidden?: boolean
    min?: number
    max?: number
    default?: string
    mask?: string
    validation?: object
    error?: string
    step?: string
    required?: boolean
    icon?: string
    classInput?: string
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    type: 'text',
    disabled: false,
    hidden: false,
    min: 0,
    max: 999999999,
    default: '',
    mask: '',
    error: '',
    step: 'any',
    required: false,
    icon: '',
    classInput: '',
  }
)

const emit = defineEmits(['update:modelValue', 'enter'])

const emitUpdate = (val: string) => {
  emit('update:modelValue', val)
}

onMounted(() => {
  if (props.default) {
    if (props.modelValue === '') {
      emitUpdate(props.default)
    }
  }
})
</script>

<template>
  <div class="relative" :class="[hidden ? 'hidden' : '']">
    <label class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <DIcon
      v-if="icon"
      :name="icon"
      class="text-gray-500 absolute pt-2 pl-2 w-7 h-7"
    />
    <input
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :type="type"
      :autocomplete="type === 'password' ? 'on' : 'off'"
      class="focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent block w-full shadow-sm text-sm border rounded-md py-2 px-2"
      :min="min"
      :max="max"
      :step="step"
      @input="($event: any) => emitUpdate($event.target.value)"
      @keyup.enter="emit('enter')"
      :class="[
        disabled ? 'bg-gray-200 cursor-no-drop' : 'bg-white',
        icon ? 'pl-9' : 'pl',
        error ? 'border-red-500' : 'border-gray-300',
        classInput,
      ]"
    />
    <label v-if="hint">
      <span class="text-xs text-red-500">{{ hint }}</span>
    </label>
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
