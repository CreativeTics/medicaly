import { UserPassword } from '../../../domain/user-password'
import { UserRepository } from '../../../domain/user-repository'
import {
  UpdateUserDto,
  UpdateUserResponse,
  RoleNotFoundError,
  UpdateUserValidationError,
  UserNotFoundError,
} from './'

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: UpdateUserDto): Promise<UpdateUserResponse> {
    const user = await this.userRepository.getById(dto.id)
    if (!user) {
      throw new UserNotFoundError()
    }
    const role = await this.userRepository.getRoleById(dto.roleId)
    if (!role) {
      throw new RoleNotFoundError()
    }

    try {
      const newPassword = UserPassword.create(dto.password)
      user.setNewPassword(newPassword)
      user.setNewRole(role)
    } catch (error) {
      throw new UpdateUserValidationError(error.message)
    }
    await this.userRepository.update(user)
    return { id: user.id }
  }
}
