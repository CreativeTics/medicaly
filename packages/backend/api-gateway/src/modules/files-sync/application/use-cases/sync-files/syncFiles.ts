import {
  FileSyncRepository,
  FileDocument,
  SyncResult,
} from '../../../domain/file-sync-repository'
import { SyncFilesDto } from './dto'
import { SyncFilesResponse } from './response'

const DEFAULT_LIMIT = 50

export class SyncFilesUseCase {
  constructor(private fileSyncRepository: FileSyncRepository) {}

  async execute(dto: SyncFilesDto): Promise<SyncFilesResponse> {
    const limit = dto.limit ?? DEFAULT_LIMIT
    const files = await this.fileSyncRepository.getUnsyncedFiles(limit)

    const result: SyncResult = {
      total: files.length,
      synced: 0,
      failed: 0,
      errors: [],
    }

    for (const file of files) {
      try {
        await this.syncFile(file)
        result.synced++
      } catch (error) {
        result.failed++
        result.errors.push({
          fileId: file._id,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return result
  }

  private async syncFile(file: FileDocument): Promise<void> {
    const attachmentName = this.getFirstAttachmentName(file)
    if (!attachmentName) {
      throw new Error('No attachment found in document')
    }

    const attachment = await this.fileSyncRepository.getAttachment(
      file._id,
      attachmentName
    )
    if (!attachment) {
      throw new Error(`Failed to download attachment "${attachmentName}"`)
    }

    const contentType =
      file._attachments?.[attachmentName]?.content_type ||
      'application/octet-stream'

    const s3Key = file.folder ? `${file.folder}${file.name}` : file.name

    await this.fileSyncRepository.uploadToS3(
      file.bucket,
      s3Key,
      attachment,
      contentType
    )
    await this.fileSyncRepository.markAsSynced(file, s3Key)
  }

  private getFirstAttachmentName(file: FileDocument): string | null {
    if (!file._attachments) return null
    const names = Object.keys(file._attachments)
    return names.length > 0 ? names[0] : null
  }
}
