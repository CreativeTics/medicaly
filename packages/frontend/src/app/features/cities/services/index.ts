import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'cities'

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      'id',
      'name',
      'code',
      'departmentName',
      'countryName',
      'updatedAt',
    ],
    sort: [{ code: 'asc' }],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      code: doc.code,
      countryName: doc.countryName,
      departmentName: doc.departmentName,
      updatedAt: doc.updatedAt,
    }
  })
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    name: doc.name,
    code: doc.code,
    country: doc.country,
    department: doc.department,
  }
}

export async function create(entity: any): Promise<boolean> {
  // get country name
  const country = await pouch.use(DB.GENERAL).get(entity.country)
  const department = await pouch.use(DB.GENERAL).get(entity.department)

  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    countryCode: country.code,
    countryName: country.name,
    departmentCode: department.code,
    departmentName: department.name,
  })
  console.log('create', response)
  return true
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const country = await pouch.use(DB.GENERAL).get(entity.country)
  const department = await pouch.use(DB.GENERAL).get(entity.department)

  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    countryCode: country.code,
    countryName: country.name,
    departmentCode: department.code,
    departmentName: department.name,
  })
  console.log('edit', response)

  return true
}
