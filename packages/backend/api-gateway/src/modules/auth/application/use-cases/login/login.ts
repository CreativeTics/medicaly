import { LoginDto } from './login-dto'
import { InvalidUsernameOrPasswordError } from './login-errors'
import { LoginResponse } from './login-response'
import { UserRepository } from './user-repository'

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByUsername(dto.username)

    if (!user) {
      throw new InvalidUsernameOrPasswordError()
    }

    if (!user.passwordMatches(dto.password)) {
      throw new InvalidUsernameOrPasswordError()
    }

    return {
      token: user.generateToken(),
    }
  }
}
