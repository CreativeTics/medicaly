import { EntityId } from './entity-id'
import { RoleName } from './role-name'

export interface RoleProps {
  name: RoleName
  permissions: string[]
}

export class Role {
  private readonly _id: EntityId
  private readonly props: RoleProps

  private constructor(props: RoleProps, id: EntityId) {
    this._id = id
    this.props = props
  }

  get id(): string {
    return this._id.value
  }

  get name(): string {
    return this.props.name.value
  }

  get permissions(): string[] {
    return this.props.permissions
  }

  static create(props: RoleProps, id?: string): Role {
    if (!props.name) {
      throw new Error('Role name is required')
    }

    if (!props.permissions) {
      throw new Error('Role permissions are required')
    }

    return new Role(props, EntityId.create(id))
  }
}
