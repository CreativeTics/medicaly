<script setup>
import { ref, computed, onMounted } from 'vue'
import Pagination from './DPagination.vue'
import DInfo from '../DInfo.vue'

const props = defineProps({
  columns: Array,
  rows: Array,
  footer: Object,
  selectOptions: { type: Boolean, default: false },
  perPageDropdown: Array,
  totalRows: { type: Number, default: 0 }
})

const emit = defineEmits(['perPage', 'selected', 'offset', 'changePage'])

const emitSelected = (selected) => emit('selected', selected)
const emitPerpage = (perPage) => emit('perPage', perPage)
const emitCalcOffset = (offset) => emit('offset', offset)
const emitChangePage = () => emit('changePage')

const _currentPage = ref(1)
const perPage = ref(10)
const perPageDropdown = ref([10, 25, 50, 200])
const _offset = ref(0)
const selected = ref([])
const selectAll = ref(false)

const openInfo = ref(false)

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

const columnsTest = computed(() => {
  return props.columns.slice(2, props.columns.length)
})

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
})
</script>
<template>
  <div
    v-if="rows.length != 0"
    id="tableFix"
    style="scroll-behavior: smooth"
    :class="[selectOptions ? 'checkOn' : 'checkOff']"
    class="tableFix showInfo relative overflow-x-auto rounded-lg border-1 border-gray-600 scroll-gray text-sm">
    <table class="min-w-full table-auto shadow-lg">
      <!--------- Head --------->
      <thead>
        <tr class="bg-gray-200" style="font-size: 12.5px">
          <th v-if="selectOptions" class="p-3">
            <input
              type="checkbox"
              v-model="selectAll"
              @click="selectAllRow"
              @change="checkRow" />
          </th>
          <th
            v-for="(column, index) in columns"
            v-bind:key="index"
            :class="[column.table != undefined ? 'cursor-pointer' : '']"
            class="p-0"
            :style="'background-color:' + column.backgroundColor">
            <div
              class="flex items-center justify-start text-gray-600 px-3 py-2 hover:text-black text-left"
              style="min-height: 52px; line-height: 16px"
              :class="[
                index == 0
                  ? 'w-24'
                  : index == 1
                  ? 'w-40'
                  : index == columns.length - 1 ||
                    index == columns.length - 2 ||
                    index == columns.length - 3
                  ? 'w-40'
                  : ''
              ]">
              {{
                index == 0 ||
                index == 1 ||
                index == columns.length - 1 ||
                index == columns.length - 2 ||
                index == columns.length - 3
                  ? column.value
                  : column.key + ' - ' + column.value
              }}
            </div>
          </th>
        </tr>
      </thead>
      <!--------- Body --------->
      <tbody class="bg-gray-200 shadow-xl">
        <tr
          v-for="(row, i) in computedRows"
          v-bind:key="i"
          class="bg-white hover:bg-gray-100 h-12">
          <td v-if="selectOptions">
            <input
              class="h-full w-full"
              type="checkbox"
              :value="String(row.id)"
              v-model="selected"
              @change="checkRow" />
          </td>
          <td class="p-0 h-inherit" v-for="(item, index) in columns" v-bind:key="index">
            <div
              class="px-3 py-1 h-full flex justify-start items-center border-b-2 border-gray-100">
              <template v-if="index == 0">
                {{ row.employeeCode }}
              </template>
              <template v-else-if="index == 1">
                {{ row.employeeName }}
              </template>
              <template v-else-if="index == columns.length - 3">
                {{ row.totalAsign }}
              </template>
              <template v-else-if="index == columns.length - 2">
                {{ row.totalDed }}
              </template>
              <template v-else-if="index == columns.length - 1">
                {{ row.totalExpense }}
              </template>
              <template v-else>
                <div class="w-full break-words" style="min-width: 70px">
                  {{ row[item.key]?.quantity }}
                </div>
                <div class="w-full" style="min-width: 35px">
                  <d-info
                    v-if="row[item.key]?.evalQauntity"
                    :td="i + '' + index + '' + 1"
                    title="Formula"
                    :formula="row[item.key].evalQauntity">
                  </d-info>
                </div>
                <div class="w-full break-words font-semibold" style="min-width: 77px">
                  {{ row[item.key]?.amount }}
                </div>
                <div class="w-full" style="min-width: 35px">
                  <d-info
                    v-if="row[item.key]?.evalAmount"
                    :td="i + '' + index + '' + 2"
                    title="Formula"
                    :formula="row[item.key].evalAmount"></d-info>
                </div>
                <div class="w-full" style="min-width: 70px">
                  <template v-if="row[item.key]?.errors">
                    <div
                      class="flex justify-center items-center"
                      v-if="row[item.key].errors.length != 0">
                      <d-info
                        icon="error"
                        title="Errores"
                        :td="i + '' + index + '' + 3"
                        :errors="row[item.key].errors"></d-info>
                      <p class="text-red-700 text-xs">Errores</p>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
      <!--------- Footer --------->
      <tfoot class="bg-gray-100">
        <tr class="total-cantidad bg-white h-10">
          <th class="p-0" :colspan="selectOptions ? 3 : 2">
            <div class="flex items-center h-10 px-3">Total Cantidad</div>
          </th>
          <th v-for="item in columnsTest" v-bind:key="item">
            <div class="px-3 text-left">{{ footer[item.key].totalCant }}</div>
          </th>
        </tr>
        <tr class="total-monto bg-white h-10">
          <th class="p-0" :colspan="selectOptions ? 3 : 2">
            <div class="flex items-center h-10 px-3">Total Monto</div>
          </th>
          <th v-for="item in columnsTest" v-bind:key="item">
            <div class="px-3 text-left">{{ footer[item.key].totalAmount }}</div>
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
  <div v-if="rows.length != 0" class="mt-3 font-bold">
    <Pagination
      :per-page="perPage"
      :total-rows="totalRows"
      :start-row="startRow"
      :end-row="endRow"
      :per-page-dropdown="perPageDropdown"
      @currentPage="_currentPage = $event"
      :current-page="_currentPage"
      @perPage="perPage = $event"
      @change="calcOffset(), emitChangePage(), emitPerpage(perPage)" />
  </div>
  <div v-if="rows.length == 0">
    <h1 class="text-center font-bold mt-5 mb-14">No hay datos para mostrar</h1>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  transform: scale(1.5);
}
/* Esto es solo para el iframe de APS */
#tableFix.showInfo.paramsFalse {
  height: calc(100vh - 350px);
  transition: all 0.3s;
}
#tableFix.hiddenInfo.paramsFalse {
  height: calc(100vh - 180px);
  transition: all 0.3s;
}
#tableFix.showInfo.paramsTrue {
  height: calc(100vh - 400px);
  transition: all 0.3s;
}
#tableFix.hiddenInfo.paramsTrue {
  height: calc(100vh - 245px);
  transition: all 0.3s;
}
/* Columnas y filas fijas en la tabla */
.tableFix tbody td:first-child,
.tableFix thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 11;
}
.tableFix tbody td:nth-child(2),
.tableFix thead th:nth-child(2) {
  position: sticky;
  left: 96px;
  z-index: 11;
}
.tableFix.checkOn tbody td:nth-child(2),
.tableFix.checkOn thead th:nth-child(2) {
  position: sticky;
  left: 37px;
}
.tableFix.checkOn tbody td:nth-child(3),
.tableFix.checkOn thead th:nth-child(3) {
  position: sticky;
  left: 133px;
}
.tableFix.checkOn thead th:nth-child(3) {
  z-index: 12;
}
.tableFix thead th:first-child,
.tableFix thead th:nth-child(2) {
  z-index: 13;
}
.tableFix tbody td:first-child,
.tableFix tbody td:nth-child(2),
.tableFix.checkOn tbody td:nth-child(3) {
  background-color: white;
}
.tableFix.checkOn tbody td:nth-child(3) div,
.tableFix.checkOn thead th:nth-child(3) div,
.tableFix.checkOff tbody td:nth-child(2) div,
.tableFix.checkOff thead th:nth-child(2) div,
.tableFix tfoot .total-cantidad th:first-child div,
.tableFix tfoot .total-monto th:first-child div {
  border-right: 1.5px solid #c7c6c6;
}
.tableFix thead th {
  position: sticky;
  top: 0;
  z-index: 11;
  background-color: #e5e7eb;
}
.tableFix tfoot tr:first-child th:first-child,
.tableFix tfoot tr:nth-child(2) th:first-child,
.tableFix.checkOn tfoot tr:nth-child(3) th:first-child {
  z-index: 11;
}
.tableFix tfoot tr th {
  position: sticky;
  z-index: 9;
  background-color: #f3f4f6;
}
.tableFix tfoot tr:first-child th {
  bottom: 40px;
}

.tableFix tfoot tr:nth-child(2) th {
  bottom: 0;
}
.tableFix tfoot th:first-child {
  position: sticky;
  left: 0;
  z-index: 12;
}
.tableFix tfoot .total-monto th,
.tableFix tfoot .total-cantidad th {
  background-color: #e9e9e9;
}
/* Diseño del scroll en el menu */
.scroll-gray::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background: #f7f7f7;
}
.scroll-gray::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(177, 177, 177);
  border-radius: 5px;
}
.scroll-gray::-webkit-scrollbar-thumb {
  background: #cecece;
  border-radius: 5px;
}
.scroll-gray::-webkit-scrollbar-thumb:hover {
  background: #bbbbbb;
}
.h-inherit {
  height: inherit;
}
</style>
