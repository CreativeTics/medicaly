import { Ref, ref } from 'vue'
export default function usePagination<T>(initialRows: T[]) {
  let rawRows: T[] = []
  let searchedRows: T[] = []
  const allPages = new Map<number, T[]>()
  const currentPage = ref(1)
  const totalPages = ref(1)
  let rowsPerPage = 10
  const currentPageRows = ref<T[]>([]) as Ref<T[]>

  // Server-side pagination mode
  const serverSide = ref(false)

  function updateRows(rows: T[]) {
    rawRows = rows
    if (serverSide.value) {
      // In server-side mode, rows are already the current page
      currentPageRows.value = rows
    } else {
      search('') // reset search
    }
  }

  function setServerSide(enabled: boolean) {
    serverSide.value = enabled
  }

  function setServerPage(page: number, pages: number, rows: T[]) {
    currentPage.value = page
    totalPages.value = pages
    currentPageRows.value = rows
  }

  function setConfig(perPageNew: number) {
    rowsPerPage = perPageNew
    if (!serverSide.value) {
      search('')
    }
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
    if (serverSide.value) {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
      return
    }
    if (currentPage.value < allPages.size) {
      currentPage.value++
      currentPageRows.value = allPages.get(currentPage.value) ?? []
    }
  }

  function prevPage() {
    if (serverSide.value) {
      if (currentPage.value > 1) {
        currentPage.value--
      }
      return
    }
    if (currentPage.value > 1) {
      currentPage.value--
      currentPageRows.value = allPages.get(currentPage.value) ?? []
    }
  }

  function goToFirsPage() {
    if (serverSide.value) {
      currentPage.value = 1
      return
    }
    currentPage.value = 1
    currentPageRows.value = allPages.get(currentPage.value) ?? []
  }

  function goToLastPage() {
    if (serverSide.value) {
      currentPage.value = totalPages.value
      return
    }
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
    goToLastPage,
    setServerSide,
    setServerPage,
    serverSide,
  }
}
