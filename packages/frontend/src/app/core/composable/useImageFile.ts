import { ref } from 'vue'
import axios from 'axios'
import { Buffer } from 'buffer'

import { DB, PouchService } from '@/app/services/pouch'

const pouch = new PouchService()

export function useImageFile(imageName: string = 'image.png') {
  const imageBase64 = ref<string>('')
  const unsaved = ref<boolean>(false)
  const lastImageId = ref<string>('')

  const loadImageFromId = async (imageId?: string) => {
    if (!imageId) {
      return
    }
    lastImageId.value = imageId
    imageBase64.value = await getImageFromFileId(imageId)
  }

  const getImageFromFileId = async (fileId: string) => {
    const response = await axios.get(
      `http://localhost:3005/api/files/${fileId}`,
      {
        responseType: 'arraybuffer',
      }
    )
    const base64 = Buffer.from(response.data, 'binary').toString('base64')
    return `data:image/png;base64,${base64}`
  }

  const saveImage = async (): Promise<string> => {
    if (unsaved.value === false) {
      return lastImageId.value
    }
    const response = await pouch.use(DB.FILES).create({
      doctype: 'files',
      createdAt: new Date(),
      name: imageName,
      _attachments: {
        [imageName]: {
          content_type: 'image/png',
          data: imageBase64.value.replace('data:image/png;base64,', ''),
          name: imageName,
        },
      },
    })

    return response?.id ?? ''
  }

  const setImage = (image: string): void => {
    imageBase64.value = image
    unsaved.value = true
  }

  return {
    imageBase64,
    unsaved,
    getImageFromFileId,
    saveImage,
    setImage,
    loadImageFromId,
  }
}
