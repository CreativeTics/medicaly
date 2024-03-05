import { Role } from './role'
import { User } from './user'

export interface UserRepository {
  findByUsername(username: string): Promise<User | undefined>
  getById(id: string): Promise<User | undefined>
  getRoleById(role: string): Promise<Role | undefined>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
}
