import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { couchHttp } from '../../../../shared/infrastructure/databases/util/http'
import {
  FileSyncRepository,
  FileDocument,
} from '../../domain/file-sync-repository'
import constants from '../../../../config'

export class CouchS3FileSyncRepository implements FileSyncRepository {
  private s3Client: S3Client

  constructor() {
    const s3Config = constants().S3
    this.s3Client = new S3Client({
      endpoint: s3Config.ENDPOINT,
      region: s3Config.REGION,
      credentials: {
        accessKeyId: s3Config.ACCESS_KEY,
        secretAccessKey: s3Config.SECRET_KEY,
      },
      forcePathStyle: true,
    })
  }

  getUnsyncedFiles = async (limit: number): Promise<FileDocument[]> => {
    const response = await couchHttp.post('/files/_find', {
      selector: {
        docType: 'files',
        synced: false,
        isDeleted: false,
      },
      limit,
    })

    if (response.status !== 200) {
      return []
    }

    return response.data.docs || []
  }

  getFileDocument = async (docId: string): Promise<FileDocument | null> => {
    const response = await couchHttp.get(`/files/${docId}`)

    if (response.status !== 200) {
      return null
    }

    return response.data
  }

  getAttachment = async (
    docId: string,
    attachmentName: string
  ): Promise<Buffer | null> => {
    const response = await couchHttp.get(
      `/files/${docId}/${encodeURIComponent(attachmentName)}`,
      {
        responseType: 'arraybuffer',
      }
    )

    if (response.status !== 200) {
      return null
    }

    return Buffer.from(response.data)
  }

  downloadFromS3 = async (
    bucket: string,
    key: string
  ): Promise<Buffer | null> => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })

      const result = await this.s3Client.send(command)

      if (!result.Body) {
        return null
      }

      const chunks: Uint8Array[] = []
      for await (const chunk of result.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks)
    } catch {
      return null
    }
  }

  uploadToS3 = async (
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<void> => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })

    await this.s3Client.send(command)
  }

  markAsSynced = async (
    doc: FileDocument,
    s3Key: string
  ): Promise<void> => {
    await couchHttp.put(`/files/${doc._id}`, {
      ...doc,
      synced: true,
      s3Key,
      updatedAt: new Date().toISOString(),
    })
  }
}
