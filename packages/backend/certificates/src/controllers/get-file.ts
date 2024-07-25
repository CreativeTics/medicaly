import { couchHttp } from '../util/http'

export class GetFileController {
  async execute(fileId: string): Promise<{
    fileName?: string
    fileType?: string
    data: Buffer
  }> {
    try {
      // 1. Get  file from database
      const response = await couchHttp.get(`/files/${fileId}`)

      if (response.status !== 200) {
        throw new Error('File not found')
      }

      if (!response.data) {
        throw new Error('File not found')
      }

      if (response.data.url) {
        // get from url
        const file = await couchHttp.get(response.data.url, {
          responseType: 'arraybuffer',
        })

        if (file.status !== 200) {
          throw new Error('File not found')
        }

        return {
          fileName: '',
          data: file.data,
        }
      }

      // get from attachments

      const fileName =
        response.data._attachments && Object.keys(response.data._attachments)[0] // get first attachment
      const fileType = response.data._attachments[fileName].content_type

      const file = await couchHttp.get(`/files/${fileId}/${fileName}`, {
        responseType: 'arraybuffer',
      })
      if (file.status !== 200) {
        throw new Error('File not found')
      }

      return {
        fileName,
        fileType,
        data: file.data,
      }
    } catch (error) {
      console.log('Error retrieving file', error)
    }
    return null
  }
}
