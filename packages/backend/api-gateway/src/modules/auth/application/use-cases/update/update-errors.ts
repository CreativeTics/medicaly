export class UserNotFoundError extends Error {
  readonly name = 'UserNotFoundError'
  readonly type = 'user'
  constructor() {
    super('User does not exist')
  }
}

export class RoleNotFoundError extends Error {
  readonly name = 'RoleNotFoundError'
  readonly type = 'user'
  constructor() {
    super('Role does not exist')
  }
}

export class UpdateUserValidationError extends Error {
  readonly name = 'UpdateUserValidationError'
  readonly type = 'user'
  constructor(message: string) {
    super(message)
  }
}
