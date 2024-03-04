import { AuthSessions } from '../../../../../shared/infrastructure/databases/util/auth-sessions'
import { UserRepository } from '../../../domain/user-repository'
import { GetSessionUserDto } from './get-session-user-dto'
import { InvalidSessionError } from './get-session-user-errors'
import { GetSessionUserResponse } from './get-session-user-response'

export class GetSessionUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: GetSessionUserDto): Promise<GetSessionUserResponse> {
    const userId = AuthSessions.instance.get(dto.token)

    if (!userId) {
      throw new InvalidSessionError()
    }

    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new InvalidSessionError()
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      type: user.type,
      relations: user.relations,
    }
  }
}
