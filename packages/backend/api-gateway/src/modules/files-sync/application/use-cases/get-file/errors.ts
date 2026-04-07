export class FileNotFoundError extends Error {
  readonly name = 'FileNotFoundError'
  readonly type = 'user'
  constructor() {
    super('File not found')
  }
}
