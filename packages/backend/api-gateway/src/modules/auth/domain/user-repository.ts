import { User } from './user'

export interface UserRepository {
  findByUsername(username: string): Promise<User | undefined>
  getById(id: string): Promise<User | undefined>
}
