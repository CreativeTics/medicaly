import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

import { UserPassword } from './user-password'
import { Username } from './user-username'
import { UserType } from './user-type'
import { Role } from './role'

export interface UserProps {
  username: Username
  password: UserPassword
  type: UserType
  role: Role
}

export class User {
  private readonly _id: string
  private readonly props: UserProps

  private constructor(id: string, props: UserProps) {
    this._id = id
    this.props = props
  }

  get id(): string {
    return this._id
  }

  get username(): string {
    return this.props.username.value
  }

  get type(): string {
    return this.props.type.value
  }

  get role() {
    return {
      id: this.props.role.id,
      name: this.props.role.name,
      permissions: this.props.role.permissions,
    }
  }

  passwordMatches(password: string): boolean {
    return this.props.password.compareWith(password)
  }

  generateToken(): string {
    return Base64.stringify(
      sha256(`${this._id}:${this.props.username.value}-${Date.now()}`)
    )
  }

  static create(id: string, props: UserProps): User {
    if (!props.username) {
      throw new Error('Username is required')
    }

    if (!props.password) {
      throw new Error('Password is required')
    }

    if (!props.type) {
      throw new Error('User type is required')
    }

    if (!props.role) {
      throw new Error('User role is required')
    }

    return new User(id, props)
  }
}
