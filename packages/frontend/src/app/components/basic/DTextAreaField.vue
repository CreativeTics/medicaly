<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder: string
    hint: string
    disabled: boolean
    rows: number
    validation: object
    error: string
    required: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    disabled: false,
    rows: 3,
    validation: () => ({}),
    error: '',
    required: false
  }
)

const emit = defineEmits(['update:modelValue', 'enter'])

const emitUpdate = (val: any) => {
  emit('update:modelValue', val.target.value)
}
</script>
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div>
      <textarea
        class="shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :rows="rows"
        @input="emitUpdate($event)"
        @keyup.enter="emit('enter')"
        :class="[{ error }, { 'bg-gray-200': disabled }]" />
    </div>
    <p v-if="!!hint" class="mt-2 text-sm text-gray-500">{{ hint }}</p>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
