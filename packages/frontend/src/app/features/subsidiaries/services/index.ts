import { formatDate } from '@/app/core/util/dates'
import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'subsidiaries'

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      'id',
      'name',
      'code',
      'fiscalId',
      'prefix',
      'lastOrderNumber',
      'updatedAt',
    ],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
      fiscalId: doc.fiscalId,
      prefix: doc.prefix,
      lastOrderNumber: doc.lastOrderNumber,
      updatedAt: formatDate(doc.updatedAt, true),
    }
  })
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    code: doc.code,
    name: doc.name,
    fiscalId: doc.fiscalId,
    serviceDeliveryCode: doc.serviceDeliveryCode,
    serviceType: doc.serviceType,
    serviceModality: doc.serviceModality,
    prefix: doc.prefix,
    lastOrderNumber: doc.lastOrderNumber,
  }
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
  })
  console.log('create', response)
  return true
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
  })
  console.log('edit', response)

  return true
}
