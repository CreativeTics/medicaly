<script setup>
import { ref, toRef, watch } from 'vue'
import {
  ChevronLeftIcon,
  ChevronLeftDoubleIcon,
  ChevronRightIcon,
  ChevronRightDoubleIcon
} from '../icons'

const perPageNew = ref(props.perPage)

const props = defineProps({
  totalRows: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 },
  startRow: { type: Number, default: 0 },
  endRow: { type: Number, default: 0 },
  perPageDropdown: { type: Array, default: () => [] }
})

const emit = defineEmits(['currentPage', 'perPage', 'change'])

const emitChange = () => emit('change')
const emitCurrentPage = (currentPage) => {
  emit('currentPage', currentPage)
}
const emitperPage = (perPage) => emit('perPage', perPage)

const currentPage = ref(1)
const currrentPageReactive = toRef(props, 'currentPage')
watch(currrentPageReactive, () => {
  currentPage.value = currrentPageReactive.value
})

const previewtPage = (init) => {
  if (currentPage.value > 1) {
    if (init == false) {
      currentPage.value--
    } else {
      currentPage.value = 1
    }
    emitCurrentPage(currentPage.value)
    emitChange()
  }
}

const nextPage = (end) => {
  if (currentPage.value * props.perPage < props.totalRows) {
    if (end == false) {
      currentPage.value++
    } else {
      currentPage.value = Math.ceil(props.totalRows / props.perPage)
    }
    emitCurrentPage(currentPage.value)
    emitChange()
  }
}

const selectCurrentPage = () => {
  currentPage.value = 1
  emitCurrentPage(currentPage.value)
  emitperPage(perPageNew.value)
  emitChange()
}
// const resetData = () => {
// 	currentPage.value = 1
// }
// defineExpose({ resetData })
</script>

<template>
  <div class="flex justify-end items-center sticky right-1 text-gray-500">
    <div class="pr-5">
      <label class="pr-7" for="">Filas por pagina : </label>
      <select v-model="perPageNew" @change="selectCurrentPage">
        <option v-for="(item, i) in perPageDropdown" :key="i" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="pl-7">
      <p>
        {{ totalRows != null ? `${startRow + 1}-${endRow} de ${totalRows}` : '' }}
      </p>
    </div>
    <div class="pr-5 pl-8 flex">
      <button
        class="rounded-full h-7 w-8"
        :class="[
          currentPage == 1
            ? 'cursor-auto text-gray-400'
            : 'hover:text-black hover:bg-gray-300'
        ]"
        @click.prevent="previewtPage(true)">
        <ChevronLeftDoubleIcon class="w-7 h-7" />
      </button>
      <button
        class="rounded-full h-7 w-8"
        :class="[
          currentPage == 1
            ? 'cursor-auto text-gray-400'
            : 'hover:text-black hover:bg-gray-300'
        ]"
        @click.prevent="previewtPage(false)">
        <ChevronLeftIcon class="w-7 h-7" />
      </button>
      <button
        class="rounded-full h-7 w-8"
        :class="[
          currentPage == Math.ceil(props.totalRows / props.perPage)
            ? 'cursor-auto text-gray-400'
            : 'hover:text-black hover:bg-gray-300'
        ]"
        @click.prevent="nextPage(false)">
        <ChevronRightIcon class="w-7 h-7" />
      </button>
      <button
        class="rounded-full h-7 w-8"
        :class="[
          currentPage == Math.ceil(props.totalRows / props.perPage)
            ? 'cursor-auto text-gray-400'
            : 'hover:text-black hover:bg-gray-300'
        ]"
        @click.prevent="nextPage(true)">
        <ChevronRightDoubleIcon class="w-7 h-7" />
      </button>
    </div>
  </div>
</template>
