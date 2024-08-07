import { http } from '../http'
import { Buffer } from 'buffer'

import { PouchService, DB } from '@/app/services/pouch'
const pouch = new PouchService()

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

export async function uploadFile(file: File) {
  const fileId = pouch.use(DB.FILES).create({
    doctype: 'files',
    name: file.name,
    size: file.size,
    type: file.type,
  })

  return fileId
}
