<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  showKey: { type: String, default: 'name' },
  valueKey: { type: String, default: 'id' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  placeholder: {
    type: String,
    default: '',
  },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const emitUpdate = (val) => {
  emit('update:modelValue', val)
}
function toggleOptions(e) {
  const option = e.target
  const value = option.value

  if (props.modelValue?.includes(value)) {
    emitUpdate(props.modelValue?.filter((v) => v !== value))
  } else {
    emitUpdate([...props.modelValue, value])
  }
}
</script>
<template>
  <div>
    <label
      class="text-sm font-medium text-gray-700 flex justify-between items-center"
      v-if="label"
    >
      <span>
        {{ label }} <span v-if="required" class="text-red-500">*</span>
      </span>
      <span class="text-xs text-gray-400">
        {{ modelValue.length }}/{{ options.length }} seleccionados
      </span>
    </label>
    <select
      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      :disabled="disabled"
      :class="[
        {
          'border-red-500': error !== '',
        },
        { 'bg-gray-300': disabled },
      ]"
      :model-value="modelValue"
      multiple
      @mousedown.prevent="toggleOptions($event)"
    >
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option[valueKey]"
        :selected="modelValue.includes(option[valueKey])"
        class="cursor-pointer flex justify-between items-center hover:bg-gray-100"
        :class="{
          'bg-blue-400': modelValue.includes(option[valueKey]),
        }"
      >
        {{ modelValue.includes(option[valueKey]) ? '✓' : '' }}
        {{ option[showKey] }}
      </option>
    </select>
    <span class="text-xs text-gray-500">{{ placeholder }}</span>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
