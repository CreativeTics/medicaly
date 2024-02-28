import { RoleName } from './role-name'

export interface RoleProps {
  name: RoleName
  permissions: string[]
}

export class Role {
  private readonly _id: string
  private readonly props: RoleProps

  private constructor(id: string, props: RoleProps) {
    this._id = id
    this.props = props
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this.props.name.value
  }

  get permissions(): string[] {
    return this.props.permissions
  }

  static create(id: string, props: RoleProps): Role {
    // validate if props is not null or undefined

    if (!props.name) {
      throw new Error('Role name is required')
    }

    if (!props.permissions) {
      throw new Error('Role permissions are required')
    }

    return new Role(id, props)
  }
}
