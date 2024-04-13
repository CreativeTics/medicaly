import { LoginDto } from './login-dto'
import { InvalidUsernameOrPasswordError } from './login-errors'
import { LoginResponse } from './login-response'
import { UserRepository } from '../../../domain/user-repository'
import { AuthSessions } from '../../../../../shared/infrastructure/databases/util/auth-sessions'

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
    const token = user.generateToken()
    AuthSessions.instance.add(token, user.id)

    return {
      token,
    }
  }
}
