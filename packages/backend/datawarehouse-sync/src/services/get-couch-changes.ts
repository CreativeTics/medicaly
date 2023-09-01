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
  return (await couchHttp.get(`/${database}/${id}`)).data
}
