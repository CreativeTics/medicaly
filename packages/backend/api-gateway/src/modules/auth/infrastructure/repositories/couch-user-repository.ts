import { UserRepository } from '../../application/use-cases/login'
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

    const user = User.create(userRow._id, {
      username: Username.create(userRow.username),
      password: UserPassword.create(userRow.encodedPassword, true),
      role: Role.create(roleRow._id, {
        name: RoleName.create(roleRow.name),
        permissions: roleRow.permissions,
      }),
      type: UserType.create(userRow.type),
    })

    return user
  }

  private async getUserRowByUsername(username: string) {
    const userResponse = await couchHttp.post('/auth/_find', {
      selector: {
        doctype: 'users',
        username,
        isDeleted: false,
      },
      fields: ['_id', 'username', 'role', 'encodedPassword', 'type'],
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
    }
  }

  private async getRoleRowById(roleId: string) {
    const roleResponse = await couchHttp.post('/auth/_find', {
      selector: {
        doctype: 'roles',
        _id: roleId,
        isDeleted: false,
      },
      fields: ['_id', 'name', 'permissions'],
    })
    if (roleResponse.status !== 200) {
      return
    }
    const roleRow = roleResponse.data.docs[0]

    return roleRow as {
      _id: string
      name: string
      permissions: string[]
    }
  }
}
