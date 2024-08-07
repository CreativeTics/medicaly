import { DB, PouchService } from '@/app/services/pouch'
import { ref } from 'vue'

const pouch = new PouchService()

export function useFileAttachment(bucket: string = 'temp') {
  const actualFileName = ref<string>('')
  const actualFileType = ref<string>('')

  const getFileUrl = async (fileId: string) => {
    return `files/api/files/${fileId}`
  }

  const saveTemp = async (
    fileName: string,
    contentType: string,
    data: string
  ): Promise<string> => {
    actualFileName.value = fileName
    actualFileType.value = contentType

    const response = await pouch.use(DB.FILES).create({
      doctype: 'files',
      bucket,
      name: fileName,
      _attachments: {
        [fileName]: {
          content_type: contentType,
          data: data.replace('data:image/png;base64,', ''),
          name: fileName,
        },
      },
    })

    return response?.id ?? ''
  }

  const changeBucket = async (fileId: string, newBucket: string) => {
    await pouch.use(DB.FILES).updateOnly(fileId, {
      bucket: newBucket,
    })
  }

  const deleteFile = (fileId: string): void => {
    actualFileName.value = ''
    actualFileType.value = ''
    pouch.use(DB.FILES).delete(fileId)
  }

  const downloadFile = async (
    fileId: string
  ): Promise<{
    name: string
    type: string
    data: string
  }> => {
    const response = await pouch.use(DB.FILES).get(fileId, {
      attachments: true,
    })

    const attachment = response?._attachments[actualFileName.value]
    return {
      name: response.name,
      type: attachment.content_type,
      data: attachment?.data ?? '',
    }
  }

  const loadFile = async (fileId: string): Promise<void> => {
    const response = await pouch.use(DB.FILES).get(fileId)

    actualFileName.value = response.name
    actualFileType.value = response.type
  }

  return {
    saveTemp,
    deleteFile,
    downloadFile,
    changeBucket,
    getFileUrl,
    actualFileName,
    actualFileType,
    loadFile,
  }
}
