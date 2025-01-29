import { getData, TableDataQuery } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'cie10'

export async function getList(searchText: string): Promise<any[]> {
  const query: TableDataQuery = {
    entity: `${DB.MEDICAL}:${doctype}`,
    fields: ['id', 'code', 'name', 'parentCode'],
    sort: [{ code: 'asc' }],
    limit: 20000,
  }
  if (searchText) {
    // filter by code or name
    query.where = {
      $or: [
        { code: { $regex: `(?i).*${searchText}.*` } },
        { name: { $regex: `(?i).*${searchText}.*` } },
      ],
    }
  }

  const data = await getData<
    {
      id: string
      code: string
      name: string
      parentCode: string
    }[]
  >(query)

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      code: doc.code,
      parentCode: doc.parentCode,
    }
  })
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
