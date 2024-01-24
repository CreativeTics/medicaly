import axios from 'axios'
import { Buffer } from 'buffer'

export async function getFileUrl(id: string) {
  const response = await axios.get(`http://localhost:3005/api/files/${id}`)
  return response.data
}

export async function getImageFromFileId(fileId: string) {
  const response = await axios.get(
    `http://localhost:3005/api/files/${fileId}`,
    {
      responseType: 'arraybuffer',
    }
  )
  const base64 = Buffer.from(response.data, 'binary').toString('base64')
  return base64
}
