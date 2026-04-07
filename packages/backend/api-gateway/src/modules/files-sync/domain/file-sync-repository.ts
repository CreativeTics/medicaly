export interface FileDocument {
  _id: string
  _rev: string
  docType: string
  bucket: string
  folder: string
  name: string
  synced: boolean
  s3Key?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  _attachments?: Record<
    string,
    {
      content_type: string
      revpos: number
      digest: string
      length: number
      stub: boolean
    }
  >
}

export interface FileContent {
  data: Buffer
  contentType: string
  fileName: string
}

export interface SyncResult {
  total: number
  synced: number
  failed: number
  errors: Array<{ fileId: string; error: string }>
}

export interface FileSyncRepository {
  getUnsyncedFiles: (limit: number) => Promise<FileDocument[]>
  getFileDocument: (docId: string) => Promise<FileDocument | null>
  getAttachment: (
    docId: string,
    attachmentName: string
  ) => Promise<Buffer | null>
  downloadFromS3: (bucket: string, key: string) => Promise<Buffer | null>
  uploadToS3: (
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string
  ) => Promise<void>
  markAsSynced: (doc: FileDocument, s3Key: string) => Promise<void>
}
