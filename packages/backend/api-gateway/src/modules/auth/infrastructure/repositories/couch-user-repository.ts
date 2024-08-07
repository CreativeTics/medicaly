import { UserRepository } from '../../domain/user-repository'
import { Role } from '../../domain/role'
import { User } from '../../domain/user'
import { UserPassword } from '../../domain/user-password'
import { Username } from '../../domain/user-username'
import { RoleName } from '../../domain/role-name'
import { UserType } from '../../domain/user-type'
import { couchHttp } from '../../../../shared/infrastructure/databases/util/http'

export class CouchUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | undefined> {
    const userRow = await this.getUserRowByUsername(username)
    if (!userRow) {
      return undefined
    }
    const roleRow = await this.getRoleRowById(userRow.role)

    const user = User.create(
      {
        username: Username.create(userRow.username),
        password: UserPassword.create(userRow.encodedPassword, true),
        role: Role.create(
          {
            name: RoleName.create(roleRow.name),
            permissions: roleRow.permissions,
          },
          roleRow._id
        ),
        type: UserType.create(userRow.type),
        relations: userRow.relations ?? [],
      },
      userRow._id
    )

    return user
  }

  async getById(id: string): Promise<User | undefined> {
    const userResponse = await couchHttp.get(`/auth/${id}`)
    if (userResponse.status !== 200) {
      return undefined
    }
    const userRow = userResponse.data

    const roleRow = await this.getRoleRowById(userRow.role)

    const user = User.create(
      {
        username: Username.create(userRow.username),
        password: UserPassword.create(userRow.encodedPassword, true),
        role: Role.create(
          {
            name: RoleName.create(roleRow.name),
            permissions: roleRow.permissions,
          },
          roleRow._id
        ),
        type: UserType.create(userRow.type),
        relations: userRow.relations ?? [],
      },
      userRow._id
    )

    return user
  }

  async getRoleById(roleId: string): Promise<Role | undefined> {
    const roleRow = await this.getRoleRowById(roleId)
    if (!roleRow) {
      return undefined
    }

    const role = Role.create(
      {
        name: RoleName.create(roleRow.name),
        permissions: roleRow.permissions,
      },
      roleRow._id
    )

    return role
  }

  async save(user: User): Promise<void> {
    const userRow = {
      _id: user.id,
      doctype: 'users',
      username: user.username,
      encodedPassword: user.password,
      role: user.role.id,
      type: user.type,
      relations: user.relations,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await couchHttp.put(`/auth/${user.id}`, userRow)
  }

  async update(user: User): Promise<void> {
    const oldUserResponse = await couchHttp.get(`/auth/${user.id}`)
    if (oldUserResponse.status !== 200) {
      return
    }
    const oldUserRow = oldUserResponse.data

    const userRow = {
      _id: user.id,
      _rev: oldUserRow._rev,
      doctype: 'users',
      username: user.username,
      encodedPassword: user.password,
      role: user.role.id,
      type: user.type,
      relations: user.relations,
      isDeleted: false,
      createdAt: oldUserRow.createdAt,
      updatedAt: new Date().toISOString(),
    }
    await couchHttp.put(`/auth/${user.id}`, userRow)
  }

  private async getUserRowByUsername(username: string) {
    const userResponse = await couchHttp.post('/auth/_find', {
      selector: {
        doctype: 'users',
        username,
        isDeleted: false,
      },
      fields: [
        '_id',
        'username',
        'role',
        'encodedPassword',
        'type',
        'relations',
      ],
    })
    if (userResponse.status !== 200) {
      return
    }
    const userRow = userResponse.data.docs[0]

    return userRow as {
      _id: string
      username: string
      role: string
      encodedPassword: string
      type: string
      relations: any[]
    }
  }

  private async getRoleRowById(roleId: string) {
    const roleResponse = await couchHttp.get(`/auth/${roleId}`)
    if (roleResponse.status !== 200) {
      return
    }
    const roleRow = roleResponse.data

    return roleRow as {
      _id: string
      _rev: string
      name: string
      permissions: string[]
    }
  }
}
