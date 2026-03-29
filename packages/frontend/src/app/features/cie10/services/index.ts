import { getDataPaginated } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'cie10'

export interface Cie10ListFilters {
  searchText?: string
  page?: number
  perPage?: number
}

export async function getList(
  filters?: Cie10ListFilters
): Promise<{ rows: any[]; total: number }> {
  const page = filters?.page ?? 1
  const perPage = filters?.perPage ?? 10
  const hasTextSearch = !!filters?.searchText

  const { rows: data, total: rawTotal } = await getDataPaginated<
    {
      id: string
      code: string
      name: string
      parentCode: string
    }[]
  >(
    {
      entity: `${DB.MEDICAL}:${doctype}`,
      fields: ['id', 'code', 'name', 'parentCode'],
      sort: [{ code: 'asc' }],
      limit: hasTextSearch ? undefined : perPage,
      skip: hasTextSearch ? undefined : (page - 1) * perPage,
    },
    undefined,
    { view: 'counts/by_doctype', key: doctype }
  )

  let results = data.map((doc) => ({
    id: doc.id,
    name: doc.name,
    code: doc.code,
    parentCode: doc.parentCode,
  }))

  // Text search is applied client-side on PouchDB results
  // PouchDB $or + $regex conflicts with sort, so we fetch all and filter here
  if (hasTextSearch) {
    const term = filters!.searchText!.toLowerCase()
    results = results.filter(
      (row) =>
        row.code?.toLowerCase().includes(term) ||
        row.name?.toLowerCase().includes(term)
    )
    const total = results.length
    const start = (page - 1) * perPage
    return { rows: results.slice(start, start + perPage), total }
  }

  return { rows: results, total: rawTotal }
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.MEDICAL).get(id)
  return {
    code: doc.code,
    name: doc.name,
    parentCode: doc.parentCode,
  }
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.MEDICAL).create({
    doctype,
    ...entity,
  })
  console.log('create', response)
  return true
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.MEDICAL).update({
    doctype,
    id,
    ...entity,
  })
  console.log('edit', response)

  return true
}
