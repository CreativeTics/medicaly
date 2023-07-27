<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDownIcon, Loading02Icon } from './icons'

const optionShow = ref(false)
const showLabel = ref(true)
const showInput = ref(false)
const input = ref(null)

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    label: string
    hint: string
    options: any[]
    showKey: string
    valueKey: string
    disabled: boolean
    error: string
    required: boolean
    placeholder: string
  }>(),
  {
    modelValue: '',
    label: '',
    hint: '',
    options: () => [],
    showKey: 'name',
    valueKey: 'id',
    disabled: false,
    error: '',
    required: false,
    placeholder: 'Seleccione'
  }
)

const emit = defineEmits(['update:modelValue', 'filter', 'focus', 'change'])

const emitUpdate = (val) => {
  emit('update:modelValue', val)
}

const emitFilter = (filter) => emit('filter', filter)
const emitFocus = () => emit('focus')
const emitChange = (event) => emit('change', event)

const nameValue = computed(() => {
  return (
    props.options.find((item) => item[props.valueKey] == props.modelValue)?.[
      props.showKey
    ] || `${props.placeholder}`
  )
})

const showOptions = () => {
  if (!props.disabled) {
    optionShow.value = true
    focusSearch()
  }
}

const exit = () => {
  optionShow.value = false
  showLabel.value = true
  showInput.value = false
  emitFilter('')
}

const selectOption = (option) => {
  optionShow.value = false
  showLabel.value = true
  showInput.value = false
  emitFilter('')

  if (option[props.valueKey]) {
    emitUpdate(String(option[props.valueKey]))
    emitChange(String(option[props.valueKey]))
  } else {
    emitUpdate('')
    emitChange('')
  }
}

const focusSearch = () => {
  setTimeout(() => {
    input.value.focus()
  }, 1)
}
</script>
<template>
  <div class="relative block">
    <label class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <label
      v-if="!optionShow"
      class="w-full flex justify-between items-center rounded-md shadow-sm border py-2 px-2 gap-2 cursor-default"
      :class="[
        disabled ? 'bg-gray-200 cursor-no-drop ' : 'bg-white',
        error === '' ? 'btn-block border-gray-300' : 'border-red-500'
      ]"
      @click="showOptions">
      <span v-if="options.length > 0" class="text-sm truncate ...">
        {{ `${nameValue}` }}
      </span>
      <span v-else class="text-gray-400 text-sm truncate ...">
        {{ `Esperando datos...` }}
      </span>
      <ChevronDownIcon
        v-if="options.length > 0"
        class="ml-2 w-4 h-4 text-black font-black" />
      <Loading02Icon v-else class="rotate text-gray-400" />
    </label>
    <input
      ref="input"
      v-if="optionShow"
      class="mt-1 block w-full py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm cursor-pointer"
      :class="[{ error }, { 'bg-gray-300': disabled }]"
      @input="($event: any) => emitFilter($event.target.value)"
      @blur="exit()"
      @focusout="($event: any) => emitFocus()"
      @change="emitChange($event)"
      :disabled="disabled"
      :placeholder="placeholder" />
    <ul
      class="absolute z-10 mt-1 bg-white w-full border border-gray-300 rounded-md shadow-xl max-h-72 overflow-y-auto scroll px-1"
      v-show="optionShow">
      <li
        class="dropdown-item rounded-md my-1 hover:bg-blue-500 hover:text-white cursor-pointer text-sm px-2 py-1"
        @mousedown="selectOption(option)"
        v-for="(option, index) in options"
        :key="index">
        {{ typeof option == 'object' ? option[showKey] : option }}
      </li>
    </ul>
    <span class="text-xs text-red-500">{{ error }}</span>
    <label v-if="!!hint">
      <span class="text-xs text-red-500">{{ hint }}</span>
    </label>
  </div>
</template>
