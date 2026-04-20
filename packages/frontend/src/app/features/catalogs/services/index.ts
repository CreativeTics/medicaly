import axios from 'axios'
import { IHCE_API_URL } from '@/config'
import { useAuthStore } from '@/store/auth'

const ihceHttp = axios.create({
  baseURL: IHCE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
})

// --- Catalog list ---

export interface Catalog {
  catalogKey: string
  description: string | null
  latestVersion: number
  codingSystemReferenceUrl: string
}

export interface CatalogListResult {
  rows: Catalog[]
  total: number
}

function addAuthHeader() {
  ihceHttp.defaults.headers['Authorization'] = `Bearer ${useAuthStore().token}`
}

export async function listCatalogs(params?: {
  page?: number
  size?: number
  q?: string
}): Promise<CatalogListResult> {
  addAuthHeader()
  const page = params?.page ?? 1
  const size = params?.size ?? 25

  const queryParams: Record<string, string | number> = { page, size }
  if (params?.q) {
    queryParams.q = params.q
  }

  const { data } = await ihceHttp.get('/reference-data/catalogs', {
    params: queryParams,
  })

  return {
    rows: data.items ?? [],
    total: data.total ?? 0,
  }
}

// --- Catalog items ---

export interface CatalogItem {
  code: string
  name: string
  description: string | null
  extra: Record<string, any> | null
  version: number
}

export interface CatalogItemsResult {
  rows: CatalogItem[]
  total: number
}

export async function listCatalogItems(
  catalogKey: string,
  params?: {
    page?: number
    size?: number
    q?: string
  },
): Promise<CatalogItemsResult> {
  addAuthHeader()
  const page = params?.page ?? 1
  const size = params?.size ?? 25

  const queryParams: Record<string, string | number> = { page, size }
  if (params?.q) {
    queryParams.q = params.q
  }

  const { data } = await ihceHttp.get(
    `/reference-data/catalogs/${catalogKey}/items`,
    { params: queryParams },
  )

  return {
    rows: data.items ?? [],
    total: data.total ?? 0,
  }
}
