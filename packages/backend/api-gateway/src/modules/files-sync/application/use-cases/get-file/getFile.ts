import {
  FileSyncRepository,
  FileContent,
} from '../../../domain/file-sync-repository'
import { GetFileDto } from './dto'
import { GetFileResponse } from './response'
import { FileNotFoundError } from './errors'

export class GetFileUseCase {
  constructor(private fileSyncRepository: FileSyncRepository) {}

  async execute(dto: GetFileDto): Promise<GetFileResponse> {
    const doc = await this.fileSyncRepository.getFileDocument(dto.fileId)

    if (!doc || doc.isDeleted) {
      throw new FileNotFoundError()
    }

    // If synced, try S3 first
    if (doc.synced && doc.s3Key) {
      const data = await this.fileSyncRepository.downloadFromS3(
        doc.bucket,
        doc.s3Key
      )

      if (data) {
        return {
          data,
          contentType: this.getContentType(doc),
          fileName: doc.name,
        }
      }
    }

    // Fallback to CouchDB attachment
    const attachmentName = this.getFirstAttachmentName(doc)
    if (!attachmentName) {
      throw new FileNotFoundError()
    }

    const data = await this.fileSyncRepository.getAttachment(
      doc._id,
      attachmentName
    )

    if (!data) {
      throw new FileNotFoundError()
    }

    return {
      data,
      contentType:
        doc._attachments?.[attachmentName]?.content_type ||
        'application/octet-stream',
      fileName: doc.name,
    }
  }

  private getContentType(doc: any): string {
    if (doc._attachments) {
      const firstKey = Object.keys(doc._attachments)[0]
      if (firstKey) {
        return doc._attachments[firstKey].content_type || 'application/octet-stream'
      }
    }
    return 'application/octet-stream'
  }

  private getFirstAttachmentName(doc: any): string | null {
    if (!doc._attachments) return null
    const names = Object.keys(doc._attachments)
    return names.length > 0 ? names[0] : null
  }
}
