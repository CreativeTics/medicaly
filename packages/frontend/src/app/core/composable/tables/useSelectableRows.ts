import { ref } from 'vue'
export default function useSelectableRows<T>(rawRows: T[]) {
  let selectRowsProp = 'id'
  const selectedRows = ref<string[]>([])
  const selectedAllRows = ref<boolean>()

  const toggleRow = (id: string) => {
    if (selectedRows.value.includes(id)) {
      selectedRows.value = selectedRows.value.filter(row => row !== id)
      selectedAllRows.value = selectedRows.value.length === rawRows.length
      return
    }
    selectedRows.value.push(id)
    selectedAllRows.value = selectedRows.value.length === rawRows.length
  }

  const toggleAllRow = () => {
    if (selectedRows.value.length === rawRows.length) {
      selectedRows.value = []
      return
    }
    selectedRows.value = rawRows.map((row: any) => row[selectRowsProp])
  }

  function setRows(rows: T[]) {
    rawRows = rows
  }

  function setSelectProp(prop: string) {
    selectRowsProp = prop
  }

  return {
    setRows,
    setSelectProp,
    selectedRows,
    selectedAllRows,
    toggleRow,
    toggleAllRow
  }
}
