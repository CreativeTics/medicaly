import { useAuthStore } from '@/store/auth'
import { PouchService, DB } from '../../../services/pouch'
import { API_URL } from '@/config'
import { http } from '@/app/core/services/http'
const pouch = new PouchService()

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    code: doc.code,
    name: doc.name,
    header: doc.header,
    footer: doc.footer,
    body: doc.body,
    props: JSON.stringify(doc.props, undefined, 4),
  }
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const props = JSON.parse(entity.props) || {}

  const response = await pouch.use(DB.GENERAL).update({
    doctype: 'templates',
    id,
    ...entity,
    props,
  })
  console.log('edit', response)
  return !!response?.ok
}

export async function getPreviewPrintTemplateUrl(
  code: string,
  orderId: string
): Promise<string> {
  const certificate = await http.post(
    'files/api/certificates/',
    {
      order: orderId,
      code,
    },
    {
      headers: {
        Authorization: `${useAuthStore().token}`,
      },
    }
  )

  // get informed consent Url
  return `${API_URL}/files/api/files/${certificate.data?.id}?h=${encodeURI(
    useAuthStore().token
  )}`
}
