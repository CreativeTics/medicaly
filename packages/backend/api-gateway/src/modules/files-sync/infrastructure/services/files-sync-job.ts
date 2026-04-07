import { SyncFilesUseCase } from '../../application/use-cases/sync-files'
import { CouchS3FileSyncRepository } from '../repositories/couch-s3-file-sync-repository'
import constants from '../../../../config'

export function startFilesSyncJob(): void {
  const { INTERVAL_MS, BATCH_SIZE } = constants().FILES_SYNC

  const syncUseCase = new SyncFilesUseCase(new CouchS3FileSyncRepository())

  console.log(
    `[files-sync] Starting sync job (interval: ${INTERVAL_MS / 1000}s, batch: ${BATCH_SIZE})`
  )

  const runSync = async () => {
    try {
      const result = await syncUseCase.execute({ limit: BATCH_SIZE })

      if (result.total > 0) {
        console.log(
          `[files-sync] Synced ${result.synced}/${result.total} files` +
            (result.failed > 0 ? ` (${result.failed} failed)` : '')
        )
      }

      if (result.errors.length > 0) {
        for (const err of result.errors) {
          console.error(`[files-sync] File ${err.fileId}: ${err.error}`)
        }
      }
    } catch (error) {
      console.error('[files-sync] Sync job error:', error)
    }
  }

  // Run immediately on startup, then on interval
  runSync()
  setInterval(runSync, INTERVAL_MS)
}
