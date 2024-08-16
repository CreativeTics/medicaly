export class RoleName {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  static create(value: string): RoleName {
    if (value.length < 3) {
      throw new Error('Role name must be at least 3 characters long')
    }

    if (value.length > 50) {
      throw new Error('Role name must be at most 50 characters long')
    }

    if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
      throw new Error(
        'Role name must contain only letters, numbers, and spaces'
      )
    }

    return new RoleName(value)
  }
}
