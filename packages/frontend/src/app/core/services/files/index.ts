import { http } from '../http'
import { Buffer } from 'buffer'

export async function getFileUrl(id: string) {
  const response = await http.get(`/files/${id}`)
  return response.data
}

export async function getImageFromFileId(fileId: string) {
  const response = await http.get(`/files/${fileId}`, {
    responseType: 'arraybuffer',
  })
  const base64 = Buffer.from(response.data, 'binary').toString('base64')
  return base64
}
