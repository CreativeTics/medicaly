export class NoFilesToSyncError extends Error {
  readonly name = 'NoFilesToSyncError'
  readonly type = 'user'
  constructor() {
    super('No unsynced files found')
  }
}
