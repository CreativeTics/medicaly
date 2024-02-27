<script setup lang="ts">
import { computed, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | Array<string | number>
    allModel: any
    label?: string
    placeholder?: string
    hint?: string
    hidden?: boolean
    min?: number
    max?: number
    default?: string
    mask?: string
    validation?: object
    error?: string
    sizeModel: string
    weightModel: string
    required?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    hidden: false,
    min: 0,
    max: 999999999,
    default: '',
    mask: '',
    error: '',
    sizeModel: '',
    weightModel: '',
    required: false,
  }
)

const emit = defineEmits(['update:modelValue', 'enter'])

const IMCValue = computed(() => {
  if (props.sizeModel && props.weightModel) {
    const size = parseFloat(props.allModel[props.sizeModel]) / 100 // cm to m
    const weight = parseFloat(props.allModel[props.weightModel])
    if (size && weight) {
      console.log('IMCValue', size, weight)
      const imc = (weight / (size * size)).toFixed(2)
      emitUpdate(imc)
      return imc
    }
    return '0.0'
  }
  return '0.0'
})

const IMC_RANGE = {
  UNDERWEIGHT: 'Bajo peso',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Sobrepeso',
  OBESITY: 'Obesidad',
}

const IMCRange = computed<{
  range: string
  color: string
}>(() => {
  const imc = parseFloat(IMCValue.value)
  if (imc) {
    if (imc < 18.5) {
      return {
        range: IMC_RANGE.UNDERWEIGHT,
        color: 'red-500 bg-red-100',
      }
    } else if (imc >= 18.5 && imc < 24.9) {
      return {
        range: IMC_RANGE.NORMAL,
        color: 'text-green-500 bg-green-100',
      }
    } else if (imc >= 25 && imc < 29.9) {
      return {
        range: IMC_RANGE.OVERWEIGHT,
        color: 'text-yellow-500 bg-yellow-100',
      }
    } else if (imc >= 30) {
      return {
        range: IMC_RANGE.OBESITY,
        color: 'text-red-500 bg-red-100',
      }
    }
  }
  return {
    range: '',
    color: '',
  }
})

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

      <span
        class="px-4 py-0 inline-flex text-xs leading-5 font-semibold rounded-full"
        :class="IMCRange.color"
      >
        {{ IMCRange.range }}
      </span>
    </label>

    <input
      :placeholder="placeholder"
      :value="IMCValue"
      disabled="true"
      class="focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent block w-full shadow-sm text-sm border rounded-md py-2 px-2"
      :class="[error ? 'border-red-500' : 'border-gray-300']"
    />

    <label v-if="hint">
      <span class="text-xs text-red-500">{{ hint }}</span>
    </label>
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
