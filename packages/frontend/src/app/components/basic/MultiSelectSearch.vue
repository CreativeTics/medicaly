<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { XIcon } from '../basic/icons'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    allModel?: object
    label?: string
    placeholder?: string
    hint?: string
    validation?: object
    error?: string
    required?: boolean
    default?: string[]
    allowAddSearch?: boolean
    options?: string[]
    valueKey?: string
    searchInternal?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    sizeModel: '',
    weightModel: '',
    required: false,
    allowAddSearch: false,
    valueKey: 'concat',
    searchInternal: true,
  }
)

const emit = defineEmits(['update:modelValue'])

const searchInput = ref<HTMLInputElement | null>(null)
const searchElementsComponent = ref<Array<HTMLLinkElement> | null>()
const searchText = ref('')
const searchElements = ref<Array<string>>([])
const searchActiveItem = ref(0)

const emitUpdate = (val: string[]) => {
  emit('update:modelValue', val)
}

onMounted(() => {
  if (props.default) {
    emitUpdate(props.default)
  }
})

const search = () => {
  // if (searchText.value === '') {
  //   searchElements.value = []
  //   return
  // }

  const data =
    props.options
      ?.map((_: any) => _[props.valueKey])
      .filter((_: any) =>
        _?.toLowerCase().includes(searchText.value.toLowerCase())
      ) || []

  if (props.allowAddSearch && searchText.value) data.push(searchText.value)
  if (data.length > 0) searchActiveItem.value = 0
  searchElements.value = data
}

const add = (index?: number) => {
  if (index !== undefined) {
    searchActiveItem.value = index
  }

  if (searchElements.value.length == 0 || searchActiveItem.value === -1) {
    return
  }

  const data = [
    ...props.modelValue,
    searchElements.value[searchActiveItem.value],
  ]
  searchElements.value = []
  searchText.value = ''
  searchActiveItem.value = -1
  emitUpdate(data)
}

const remove = (index: number) => {
  const data = props.modelValue.filter((_, i) => i !== index)
  emitUpdate(data)
}

// Search
const searchUp = () => {
  console.log('up')
  searchActiveItem.value =
    searchActiveItem.value - 1 < 0 ? 0 : searchActiveItem.value - 1
  fixSearchItemScroll()
}
const searchDown = () => {
  searchActiveItem.value =
    searchActiveItem.value + 1 > searchElements.value.length - 1
      ? searchElements.value.length - 1
      : searchActiveItem.value + 1
  fixSearchItemScroll()
}

const fixSearchItemScroll = () => {
  const item = searchElementsComponent.value?.[searchActiveItem.value]
  if (item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- model Value  -->
    <ul>
      <li v-for="(item, i) in modelValue" :key="i" class="flex gap-3 mb-1">
        <span
          class="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 flex justify-center items-center"
        >
          {{ i + 1 }}
        </span>
        <span
          class="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-800 w-full flex justify-between items-center"
        >
          <span>{{ item }}</span>
          <div class="flex items-center justify-center">
            <!-- <ChevronUpIcon class="h-6 w-6 text-gray-500" />
            <ChevronDownIcon class="h-6 w-6 text-gray-500" /> -->
            <XIcon
              class="h-6 w-6 text-gray-500 cursor-pointer"
              @click="remove(i)"
            />
          </div>
        </span>
      </li>
    </ul>

    <input
      ref="searchInput"
      v-model="searchText"
      :placeholder="
        placeholder ||
        'busca por código o descripción y presiona enter para buscar...'
      "
      class="focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent block w-full shadow-sm text-sm border rounded-md py-2 px-2 mt-2"
      @keyup.enter="add()"
      @keyup.up.prevent="searchUp"
      @keyup.down.prevent="searchDown"
      @keyup.esc="searchElements = []"
      @input="search"
      @blur="searchText = ''"
    />

    <div
      v-if="searchElements.length > 0"
      class="absolute z-10 bg-white w-full max-h-64 overflow-y-scroll border border-gray-300 rounded-md shadow-lg mt-1 p-4"
      @click="searchInput?.focus()"
    >
      <ul>
        <li
          v-for="(item, i) in searchElements"
          ref="searchElementsComponent"
          :key="i"
          class="p-1 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200 ease-in-out rounded-md mb-1"
          :class="searchActiveItem === i ? 'bg-blue-500 text-white' : ''"
          @click="add(i)"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <label v-if="hint">
      <span class="text-xs text-red-500">{{ hint }}</span>
    </label>
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
