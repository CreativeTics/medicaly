export class InvalidUsernameOrPasswordError extends Error {
  constructor() {
    super('Invalid username or password')
  }
}
