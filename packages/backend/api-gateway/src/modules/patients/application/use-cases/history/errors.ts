export class PatientNotFoundError extends Error {
  readonly name = 'PatientNotFoundError'
  readonly type = 'user'
  constructor() {
    super('Patient not found!')
  }
}
