import { User } from '../../../domain/user'

export interface UserRepository {
  findByUsername(username: string): Promise<User | undefined>
}
