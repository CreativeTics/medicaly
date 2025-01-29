import { getData } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'recommendations'

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.MEDICAL}:${doctype}`,
    fields: ['id', 'code', 'name', 'updatedAt'],
    sort: [{ code: 'asc' }],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      code: doc.code,
      updatedAt: doc.updatedAt,
    }
  })
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.MEDICAL).get(id)
  return {
    code: doc.code,
    name: doc.name,
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
