import { PouchService, DB } from '../../../services/pouch'
const pouch = new PouchService()

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    code: doc.code,
    name: doc.name,
    header: doc.header,
    footer: doc.footer,
    body: doc.body,
  }
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype: 'templates',
    id,
    ...entity,
  })
  console.log('edit', response)
  return !!response?.ok
}
