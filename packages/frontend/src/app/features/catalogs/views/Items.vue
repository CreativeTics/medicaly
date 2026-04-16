<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
import { DBtn, DTextField } from '@/app/components/basic'

const PaginatedTable = defineAsyncComponent(
  () => import('@components/PaginatedTable.vue'),
)

import { listCatalogItems } from '../services'
import type { CatalogItem } from '../services'

const route = useRoute()
const router = useRouter()
const notifications = useNotificationsStore()

const catalogKey = computed(() => route.params.catalogKey as string)

const columns = [
  { key: 'code', title: 'Código', align: 'left' },
  { key: 'name', title: 'Nombre', align: 'left' },
  { key: 'version', title: 'Versión', align: 'left' },
]

const data = ref<CatalogItem[]>([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = 25
const searchText = ref('')
const loading = ref(false)

// Extra keys discovered from data (dynamic columns)
const extraKeys = ref<string[]>([])

const allColumns = computed(() => {
  const extra = extraKeys.value.map((key) => ({
    key: `extra_${key}`,
    title: key,
    align: 'left',
  }))
  return [...columns, ...extra]
})

const flattenedRows = computed(() => {
  return data.value.map((item) => {
    const row: Record<string, any> = {
      code: item.code,
      name: item.name,
      version: item.version,
    }
    if (item.extra) {
      for (const key of extraKeys.value) {
        row[`extra_${key}`] = item.extra[key] ?? ''
      }
    }
    return row
  })
})

const loadData = async () => {
  loading.value = true
  try {
    const result = await listCatalogItems(catalogKey.value, {
      page: currentPage.value,
      size: perPage,
      q: searchText.value || undefined,
    })
    data.value = result.rows
    totalRows.value = result.total

    // Discover extra keys from first page of results
    if (result.rows.length > 0 && extraKeys.value.length === 0) {
      const keys = new Set<string>()
      for (const item of result.rows) {
        if (item.extra) {
          Object.keys(item.extra).forEach((k) => keys.add(k))
        }
      }
      extraKeys.value = Array.from(keys)
    }
  } catch {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se pudieron cargar los elementos del catálogo "${catalogKey.value}"`,
    })
  } finally {
    loading.value = false
  }
}

const onSearch = async () => {
  currentPage.value = 1
  await loadData()
}

const onPageChange = async (page: number) => {
  currentPage.value = page
  await loadData()
}

const goBack = () => {
  router.push({ name: 'catalogs.list' })
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive flex items-center gap-4">
        <div>
          <p class="text-3xl font-semibold text-shadow">
            Catálogo: {{ catalogKey }}
          </p>
          <p class="text-gray-500 text-shadow">
            Elementos del catálogo (solo lectura)
          </p>
        </div>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="allColumns"
          :rows="flattenedRows"
          :server-side="true"
          :total-rows="totalRows"
          :per-page="perPage"
          style="height: calc(100vh - 200px)"
          @page-change="onPageChange"
        >
          <template #header>
            <div class="py-3 flex items-end sm:mb-0 sm:w-2/3 md:w-1/2 lg:w-5/12">
              <DTextField
                placeholder="Buscar por código o nombre..."
                :icon="'SearchLgIcon'"
                class="mr-2 w-full"
                v-model="searchText"
                @keyup.enter="onSearch"
              />
              <DBtn class="h-10 w-24" @click.prevent="onSearch">Buscar</DBtn>
            </div>
            <div class="py-3">
              <DBtn @click.prevent="goBack">Volver</DBtn>
            </div>
          </template>
        </PaginatedTable>
      </div>
    </div>
  </div>
</template>
