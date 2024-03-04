import { http } from '@/app/core/services/http'
import { PouchService, DB } from '@/app/services/pouch'

import { useAuthStore } from '@/store/auth'

const pouch = new PouchService()

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const response = await http.post('/auth/login', {
    username,
    password,
  })

  if (response.status === 401) {
    return false
  }

  const sessionUser = await http.get('/auth/session', {
    headers: {
      Authorization: `${response.data.token}`,
    },
  })

  await useAuthStore().setSession(sessionUser.data, response.data.token)
  return true
}

export class User {
  username: string
  password: string
  fullName: string
  role: string

  constructor(
    username: string,
    password: string,
    fullName: string,
    role: string
  ) {
    this.username = username
    this.password = password
    this.fullName = fullName
    this.role = role
  }
}

export async function getUsers(): Promise<User[]> {
  const docs: any = await pouch
    .use(DB.AUTH)
    .find({ selector: { doctype: 'users' } })

  return docs.map((doc: any) => ({
    id: doc._id,
    rev: doc._rev,
    username: doc.username,
    fullName: doc.fullName,
    role: doc.role,
  }))
}
