import { ulid } from 'ulid'

export class EntityId {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  static create(value: string): EntityId {
    if (!!value === false) {
      return new EntityId(ulid())
    }
    return new EntityId(value)
  }
}
