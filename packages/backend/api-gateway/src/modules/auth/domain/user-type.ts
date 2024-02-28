export enum UserTypeEnum {
  EMPLOYEE = 'employee',
  CONTRACT = 'contract-user',
  LABORATORY = 'laboratory-user',
}

export class UserType {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  static create(value: string): UserType {
    if (
      value !== 'employee' &&
      value !== 'contract-user' &&
      value !== 'laboratory-user'
    ) {
      throw new Error('Invalid user type')
    }

    return new UserType(value)
  }
}
