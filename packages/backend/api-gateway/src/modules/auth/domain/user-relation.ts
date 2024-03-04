interface UserRelationProps {
  contractId: string
  contractName: string
  subsidiaries: string[]
}

export class UserRelation {
  private readonly _value: UserRelationProps

  private constructor(value: UserRelationProps) {
    this._value = value
  }

  get value(): UserRelationProps {
    return this._value
  }

  static create(
    contractId: string,
    contractName: string,
    subsidiaries: string[]
  ): UserRelation {
    return new UserRelation({
      contractId,
      contractName,
      subsidiaries,
    })
  }
}
