<script setup>
const props = defineProps({
  modelValue: { type: [String, Number, Object, Array, Boolean], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  showKey: { type: String, default: 'name' },
  valueKey: { type: String, default: 'id' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  placeholder: {
    type: String,
    required: false,
    default: 'Seleccione una opcion'
  },
  required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const emitUpdate = (val) => {
  emit('update:modelValue', val)
}
</script>
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700" v-if="label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      :disabled="disabled"
      :class="[{ error }, { 'bg-gray-300': disabled }]"
      :value="modelValue"
      v-bind="{
        ...$attrs,
        onChange: ($event) => {
          emitUpdate($event.target.value)
        }
      }">
      <option disabled :value="null">
        {{ `Seleccione ${label}` }}
      </option>
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option[valueKey]"
        :selected="
          typeof option == 'object'
            ? option[valueKey] == modelValue
            : option[i] == modelValue
        ">
        {{ typeof option == 'object' ? option[showKey] : options[i] }}
      </option>
    </select>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
