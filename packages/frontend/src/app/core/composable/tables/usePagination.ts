import { Ref, ref } from 'vue'
export default function usePagination<T>(initialRows: T[]) {
  let rawRows: T[] = []
  let searchedRows: T[] = []
  const allPages = new Map<number, T[]>()
  const currentPage = ref(1)
  const totalPages = ref(1)
  let rowsPerPage = 10
  const currentPageRows = ref<T[]>([]) as Ref<T[]>

  function updateRows(rows: T[]) {
    rawRows = rows
    search('') // reset search
  }

  function setConfig(perPageNew: number) {
    rowsPerPage = perPageNew
    search('')
  }

  function search(search: string) {
    searchedRows = rawRows.filter(row => {
      const searchTerm = search.toLowerCase()
      for (const key in row) {
        const value = String(row[key]).toLowerCase()
        if (value.includes(searchTerm)) {
          return true
        }
      }
      return false
    })
    paginate()
  }

  function paginate() {
    allPages.clear()
    let count = 1
    while (searchedRows.length > 0) {
      const page = searchedRows.splice(0, rowsPerPage)
      allPages.set(count++, page)
    }
    currentPage.value = 1
    currentPageRows.value = allPages.get(currentPage.value) ?? []
    totalPages.value = allPages.size
  }

  function nextPage() {
    if (currentPage.value < allPages.size) {
      currentPage.value++
      currentPageRows.value = allPages.get(currentPage.value) ?? []
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
      currentPageRows.value = allPages.get(currentPage.value) ?? []
    }
  }

  function goToFirsPage() {
    currentPage.value = 1
    currentPageRows.value = allPages.get(currentPage.value) ?? []
  }

  function goToLastPage() {
    currentPage.value = allPages.size
    currentPageRows.value = allPages.get(currentPage.value) ?? []
  }

  updateRows(initialRows) // init
  return {
    updateRows,
    rawRows,
    setConfig,
    search,
    currentPage,
    totalPages,
    currentPageRows,
    nextPage,
    prevPage,
    goToFirsPage,
    goToLastPage
  }
}
