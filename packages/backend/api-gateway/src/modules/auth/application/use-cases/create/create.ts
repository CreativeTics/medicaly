import { User } from '../../../domain/user'
import { UserPassword } from '../../../domain/user-password'
import { UserRepository } from '../../../domain/user-repository'
import { UserType } from '../../../domain/user-type'
import { Username } from '../../../domain/user-username'
import {
  CreateUserDto,
  CreateUserResponse,
  CreateUserValidationError,
  RoleNotExistError,
  UserAlreadyExistsError,
} from './'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<CreateUserResponse> {
    const user = await this.userRepository.findByUsername(dto.username)
    if (user) {
      throw new UserAlreadyExistsError()
    }
    const role = await this.userRepository.getRoleById(dto.roleId)

    if (!role) {
      throw new RoleNotExistError()
    }

    let newUser: User
    try {
      const username = Username.create(dto.username)
      const password = UserPassword.create(dto.password)
      const type = UserType.create(dto.type)
      const relations = []

      newUser = User.create({
        username,
        password,
        type,
        role: role,
        relations,
      })
    } catch (error) {
      throw new CreateUserValidationError(error.message)
    }
    await this.userRepository.save(newUser)

    return { id: newUser.id }
  }
}
