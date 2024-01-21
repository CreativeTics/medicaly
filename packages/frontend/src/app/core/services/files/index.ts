import axios from 'axios'

export async function getFileUrl(id: string) {
  const response = await axios.get(`http://localhost:3005/api/files/${id}`)
  return response.data
}
