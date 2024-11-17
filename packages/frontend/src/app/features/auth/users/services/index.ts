import Base64 from 'crypto-js/enc-base64'
import { getData } from '../../../../core/services/get-table/'

import { PouchService, DB } from '../../../../services/pouch'
import { SHA256 } from 'crypto-js'

const pouch = new PouchService()

export async function getUsers() {
  const data = await getData<any[]>({
    entity: 'auth:users',
    fields: ['id', 'name', 'username', 'roleName', 'type', 'updatedAt'],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      username: doc.username,
      roleName: doc.roleName,
      type: doc.type,
      updatedAt: doc.updatedAt,
    }
  })
}

export async function getUser(id: string): Promise<User> {
  const doc = await pouch.use(DB.AUTH).get(id)
  return {
    name: doc.name,
    username: doc.username,
    role: doc.role,
    type: doc.type,
    tempPassword: doc.tempPassword,
  }
}

export async function create(user: User): Promise<boolean> {
  const role = await pouch.use(DB.AUTH).get(user.role)

  const encodedPassword = Base64.stringify(SHA256(user.tempPassword))

  const response = await pouch.use(DB.AUTH).create({
    doctype: 'users',
    ...user,
    roleName: role.name,
    encodedPassword,
  })
  console.log('create', response)
  return true
}

export async function edit(id: string, user: User): Promise<boolean> {
  const role = await pouch.use(DB.AUTH).get(user.role)

  if (user.tempPassword) {
    user.encodedPassword = Base64.stringify(SHA256(user.tempPassword))
  }

  const response = await pouch.use(DB.AUTH).update({
    doctype: 'users',
    id,
    ...user,
    roleName: role.name,
  })
  console.log('edit', response)

  return true
}

export async function changePassword(
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await pouch.use(DB.AUTH).get(id)

  if (Base64.stringify(SHA256(oldPassword)) !== user.encodedPassword) {
    throw new Error('Contraseña actual incorrecta!')
  }

  const response = await pouch.use(DB.AUTH).update({
    doctype: 'users',
    id,
    ...user,
    encodedPassword: Base64.stringify(SHA256(newPassword)),
  })
  console.log('changePassword', response)
}

export async function remove(id: string): Promise<boolean> {
  const response = await pouch.use(DB.AUTH).delete(id)
  console.log('delete', response)
  return true
}

export interface User {
  name: string
  username: string
  role: string
  type: 'employee' | 'contract-user' | 'laboratory-user'
  tempPassword: string
  encodedPassword?: string
}
