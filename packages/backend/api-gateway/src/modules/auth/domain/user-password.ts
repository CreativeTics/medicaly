import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

export class UserPassword {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  compareWith(password: string): boolean {
    const passwordHashed = Base64.stringify(sha256(password))
    return this._value === passwordHashed
  }

  static create(value: string, isHashed: boolean = false): UserPassword {
    if (isHashed) {
      return new UserPassword(value)
    }

    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    if (value.length > 50) {
      throw new Error('Password must be at most 50 characters long')
    }

    return new UserPassword(Base64.stringify(sha256(value)))
  }
}
