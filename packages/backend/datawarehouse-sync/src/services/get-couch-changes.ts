import { couchHttp } from '../util/http'

export async function getChanges(database: string, lastSeq: string) {
  return await couchHttp.get(`/${database}/_changes`, {
    params: {
      include_docs: true,
      since: lastSeq || 0,
    },
  })
}

export async function getDoc(database: string, id: string) {
  try {
    return (await couchHttp.get(`/${database}/${id}`)).data
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {}
    }
  }
}

export async function searchDocs(database: string, selector: any): Promise<[]> {
  const response = await couchHttp.post(`/${database}/_find`, { selector })
  return response.data.docs || []
}
