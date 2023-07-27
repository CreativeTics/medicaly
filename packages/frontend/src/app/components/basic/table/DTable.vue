<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DPagination from './DPagination.vue'
import { ArrowDownIcon, ArrowUpIcon } from '../icons'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const props = withDefaults(
  defineProps<{
    columns?: any[]
    rows?: any[]
    selectOptions: boolean
    perPageDropdown: number[]
    totalRows: number
  }>(),
  {
    columns: () => [],
    rows: () => [],
    selectOptions: false,
    perPageDropdown: () => [10, 25, 50, 200],
    totalRows: 0
  }
)

const emit = defineEmits(['perPage', 'selected', 'offset', 'changePage', 'sort'])
const emitSelected = (selected) => emit('selected', selected)
const emitPerpage = (perPage) => emit('perPage', perPage)
const emitCalcOffset = (offset) => emit('offset', offset)
const emitOrderSort = (sort, columnName) => emit('sort', [sort, columnName])
const emitChangePage = () => emit('changePage')

const columnsTable = ref(props.columns)
const sortBy = ref(false)
const sortDir = ref('asc')
const _currentPage = ref(1)
const perPage = ref(props.perPageDropdown[0])

const perPageDropdown = ref(props.perPageDropdown)
let indexAfter = ref(0)
const selected = ref([])
const selectAll = ref(false)
const _offset = ref(0)

const computedRows = computed(() => {
  return [...props.rows]
})

const startRow = computed(() => {
  return _currentPage.value == 1 ? _currentPage.value - 1 : _offset.value - perPage.value
})

const endRow = computed(() => {
  return props.rows.length < perPage.value
    ? _offset.value - perPage.value + props.rows.length
    : _offset.value
})

const sort = (name, index) => {
  if (name != undefined) {
    if (name === sortBy.value) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    }
    sortBy.value = name
    emitOrderSort(sortDir.value, sortBy.value)
    resetData()
    columnsTable.value[indexAfter.value].icon = false
    columnsTable.value[index].icon = true
    indexAfter.value = index
  }
}

const addIcon = () => {
  for (const column of props.columns) {
    column.icon = false
  }
}

const selectAllRow = () => {
  selected.value = []
  if (!selectAll.value) {
    for (let i in props.rows) {
      selected.value.push(String(props.rows[i].id))
    }
  }
  emitSelected(selected.value)
}

const checkRow = () => {
  if (props.rows.length != selected.value.length) {
    selectAll.value = false
  } else {
    selectAll.value = true
  }
  emitSelected(selected.value)
}

const resetData = () => {
  _offset.value = 0
  _currentPage.value = 1
  calcOffset()
}
defineExpose({ resetData })

const calcOffset = () => {
  _offset.value = _currentPage.value * perPage.value
  emitCalcOffset(_offset.value - perPage.value)
}
onMounted(() => {
  emitPerpage(perPage.value)
  calcOffset()
  addIcon()
})
</script>
<template>
  <div class="table-scroll z-0 pb-6">
    <div
      class="relative overflow-x-auto rounded-lg h-full scroll"
      :class="[rows.length >= 10 ? 'shadow-lg' : '']">
      <table class="min-w-full table-auto shadow-lg">
        <!----------------------------------------- Head ---------------------------------------->
        <thead class="h-14 sticky top-0">
          <tr class="bg-white">
            <th v-if="selectOptions" class="p-1 bg-white">
              <input
                type="checkbox"
                v-model="selectAll"
                @click="selectAllRow"
                @change="checkRow" />
            </th>
            <th
              v-for="(column, index) in columnsTable"
              v-bind:key="index"
              @click="sort(column.table, index)"
              :class="[column.table != undefined ? 'cursor-pointer' : '']">
              <!-- <div class="flex px-2 cursor-pointer">
                <slot :name="typeof column.title == 'undefined'?`HEAD_${column.name}`:''" v-bind="column">
                </slot>
            </div> -->
              <div
                class="flex items-center justify-start text-base text-gray-600 px-3 hover:text-gray-900">
                {{ column.title }}
                <ArrowUpIcon
                  class="h-5 ml-1"
                  v-if="
                    sortDir === 'asc' && column.icon && typeof column.title != 'undefined'
                  " />
                <ArrowDownIcon
                  class="h-5 ml-1"
                  v-if="
                    sortDir === 'desc' &&
                    column.icon &&
                    typeof column.title != 'undefined'
                  " />
              </div>
            </th>
          </tr>
        </thead>
        <!----------------------------------------- Body ------------------------------------------>
        <tbody class="bg-gray-50 shadow-xl">
          <tr
            v-for="row in computedRows"
            v-bind:key="row"
            class="bg-white border-y-2 border-gray-100 h-tr hover:bg-gray-100">
            <td v-if="selectOptions">
              <input
                class="h-full w-full"
                type="checkbox"
                :value="String(row.id)"
                v-model="selected"
                @change="checkRow" />
            </td>
            <td class="px-3" v-for="item in columns" v-bind:key="item">
              <slot
                :name="typeof row[item.name] == 'undefined' ? item.name : ''"
                v-bind="row"></slot>
              <div class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                <template
                  v-if="
                    item.name.indexOf('updated') >= 0 || item.name.indexOf('created') >= 0
                  ">
                  {{ dayjs(row[item.name]).format('DD/MM/YYYY h:mm A') }}
                </template>
                <template
                  v-else-if="
                    (item.name.indexOf('date') >= 0 ||
                      item.name.indexOf('applies_from') >= 0) &&
                    dayjs(row[item.name]).isValid()
                  ">
                  {{
                    row[item.name]
                      ? row[item.name].indexOf('/') < 0
                        ? dayjs.utc(row[item.name]).format('DD/MM/YYYY')
                        : row[item.name]
                      : ''
                  }}
                </template>
                <template v-else>
                  {{ row[item.name] }}
                </template>
              </div>
            </td>
          </tr>
          <th class="bg-white py-5" v-if="rows.length == 0" :colspan="columns.length + 1">
            <h1>No hay datos para mostrar</h1>
          </th>
        </tbody>
        <!----------------------------------------- Footer ------------------------------------------>
        <tfoot class="h-16 bg-white sticky bottom-0">
          <tr>
            <th :colspan="columns.length + 1">
              <DPagination
                v-if="$props.perPageDropdown.length > 1"
                :per-page="perPage"
                :total-rows="totalRows"
                :start-row="startRow"
                :end-row="endRow"
                :per-page-dropdown="perPageDropdown"
                @currentPage="_currentPage = $event"
                :current-page="_currentPage"
                @perPage="perPage = $event"
                @change="calcOffset(), emitChangePage(), emitPerpage(perPage)" />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<style scoped>
input[type='checkbox'] {
  transform: scale(1.5);
}
.h-tr {
  height: 3.83rem;
}
.table-scroll {
  min-height: 300px;
  height: calc(100% - 11rem);
}
@media (max-width: 850px) {
  .table-scroll {
    min-height: 300px;
    height: calc(100% - 19rem);
  }
}
</style>
