import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

import { UserPassword } from './user-password'
import { Username } from './user-username'
import { UserType } from './user-type'
import { Role } from './role'
import { UserRelation } from './user-relation'
import { EntityId } from './entity-id'

export interface UserProps {
  username: Username
  password: UserPassword
  type: UserType
  role: Role
  relations: UserRelation[]
}

export class User {
  private readonly _id: EntityId
  private readonly props: UserProps

  private constructor(props: UserProps, entityId: EntityId) {
    this._id = entityId
    this.props = props
  }

  get id(): string {
    return this._id.value
  }

  get username(): string {
    return this.props.username.value
  }

  get password(): string {
    return this.props.password.value
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

  setNewPassword(password: UserPassword) {
    this.props.password = password
  }
  setNewRole(role: Role) {
    this.props.role = role
  }

  get relations() {
    return this.props.relations.map((relation) => relation.value)
  }

  passwordMatches(password: string): boolean {
    return this.props.password.compareWith(password)
  }

  generateToken(): string {
    const token = Base64.stringify(
      sha256(`${this._id}:${this.props.username.value}-${Date.now()}`)
    )
    const sanitizedToken = token.replace(/[^a-zA-Z0-9]/g, '')
    return sanitizedToken
  }

  static create(props: UserProps, id?: string): User {
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

    if (!props.relations) {
      throw new Error('User relations are required')
    }

    return new User(props, EntityId.create(id))
  }
}
