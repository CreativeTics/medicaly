export class UserAlreadyExistsError extends Error {
  readonly name = 'UserAlreadyExistsError'
  readonly type = 'user'
  constructor() {
    super('User already exists')
  }
}

export class RoleNotExistError extends Error {
  readonly name = 'RoleNotExistError'
  readonly type = 'user'
  constructor() {
    super('Role not exist!')
  }
}

export class CreateUserValidationError extends Error {
  readonly name = 'CreateUserValidationError'
  readonly type = 'user'
  constructor(message: string) {
    super(message)
  }
}
