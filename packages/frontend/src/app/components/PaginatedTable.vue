<script setup lang="ts">
import { usePagination, useSelectableRows } from '@/app/core/composable/tables'
import { onMounted, ref, watch } from 'vue'

import { DTextField, DBtn } from './basic'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
} from './basic/icons'

interface Columns {
  title: string
  key: string
  align?: string
}
const props = withDefaults(
  defineProps<{
    rows: any[]
    columns: Columns[]
    rowsPerPage?: number[]
    perPage?: number
    enableSelectRows?: boolean
    selectRowsProp?: string
    heightTable?: string
  }>(),
  {
    rows: () => [],
    columns: () => [],
    rowsPerPage: () => [10, 25, 50, 200],
    perPage: 10,
    enableSelectRows: false,
    selectRowsProp: 'id',
    heightTable: '',
  }
)

const searchText = ref('')

const {
  currentPageRows,
  updateRows,
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToFirsPage,
  goToLastPage,
  search,
} = usePagination<any>(props.rows)

const {
  selectedRows,
  selectedAllRows,
  toggleRow,
  toggleAllRow,
  setSelectProp,
  setRows,
} = useSelectableRows<any>(props.rows)

onMounted(() => {
  setSelectProp(props.selectRowsProp)
})

watch(
  () => props.rows.length,
  () => {
    updateRows(props.rows)
    setRows(props.rows)
  }
)

defineExpose({
  updateRows,
  toggleRow,
  toggleAllRow,
  selectedRows,
  selectedAllRows,
})
</script>
<template>
  <div class="h-full w-full">
    <div class="flex justify-between w-full">
      <slot name="header" :searchText="searchText" :search="search">
        <div class="py-3 flex sm:mb-0 max-w-2xl sm:w-2/3 md:w-1/2 lg:w-5/12">
          <DTextField
            placeholder="Buscar..."
            :icon="'SearchLgIcon'"
            class="mr-2 w-full"
            v-model="searchText"
            @keyup.enter="search(searchText)"
          />
          <DBtn @click.prevent="search(searchText)">Buscar</DBtn>
        </div>
        <div class="py-3">
          <slot name="newAction"></slot>
        </div>
      </slot>
    </div>
    <div
      class="w-full h-auto overflow-y-auto scroll shadow-lg rounded-lg"
      :style="{ maxHeight: heightTable }"
    >
      <table class="min-w-full table-auto">
        <thead class="h-14 sticky top-0" style="z-index: 1">
          <tr class="bg-white">
            <th v-if="enableSelectRows" class="w-16">
              <div class="flex w-20 items-center justify-center">
                <input
                  type="checkbox"
                  @change="toggleAllRow"
                  v-model="selectedAllRows"
                />
                <span class="ml-2 text-xs text-gray-400">
                  {{ selectedRows.length }}/{{ rows.length }}
                </span>
              </div>
            </th>
            <th
              :id="column.key"
              v-for="column in columns"
              v-bind:key="column.key"
              class="px-3"
            >
              <div
                class="flex items-center justify-start text-base text-gray-600 whitespace-nowrap"
              >
                {{ column.title }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-gray-50">
          <tr
            v-for="(row, i) in currentPageRows"
            :key="i"
            class="bg-white border-y-2 border-gray-100 h-tr hover:bg-gray-100"
          >
            <slot name="row" :row="row" :columns="columns">
              <td v-if="enableSelectRows" class="w-20">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="selectedRows.includes(row[selectRowsProp])"
                    @change="toggleRow(row[selectRowsProp])"
                  />
                </div>
              </td>
              <td
                v-for="column in columns"
                v-bind:key="column.key"
                class="px-3"
              >
                <div
                  class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {{ row[column.key] }}
                </div>
              </td>
            </slot>
          </tr>
          <tr>
            <td
              class="bg-white py-5 text-center"
              v-if="currentPageRows.length == 0"
              :colspan="columns.length + 1"
            >
              <h1>No hay datos para mostrar</h1>
            </td>
          </tr>
        </tbody>
        <tfoot class="h-16 bg-white sticky bottom-0 shadow-md">
          <tr>
            <td :colspan="columns.length + 1">
              <div class="flex w-full justify-end px-4">
                <div class="flex items-center gap-4">
                  <span> Pag. {{ currentPage }} de {{ totalPages }} </span>
                  <div class="flex">
                    <ChevronLeftDoubleIcon
                      @click="goToFirsPage"
                      :class="[
                        currentPage == 1 ? 'text-gray-300' : 'text-gray-600',
                        'cursor-pointer h-7 w-7',
                      ]"
                    />
                    <ChevronLeftIcon
                      @click="prevPage"
                      :class="[
                        currentPage == 1 ? 'text-gray-300' : 'text-gray-600',
                        'cursor-pointer h-7 w-7',
                      ]"
                    />
                    <ChevronRightIcon
                      @click="nextPage"
                      :class="[
                        currentPage == totalPages
                          ? 'text-gray-300'
                          : 'text-gray-600',
                        'cursor-pointer h-7 w-7',
                      ]"
                    />
                    <ChevronRightDoubleIcon
                      @click="goToLastPage"
                      :class="[
                        currentPage == totalPages
                          ? 'text-gray-300'
                          : 'text-gray-600',
                        'cursor-pointer h-7 w-7',
                      ]"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.h-tr {
  height: 3.83rem;
}
input[type='checkbox'] {
  transform: scale(1.5);
}
</style>
