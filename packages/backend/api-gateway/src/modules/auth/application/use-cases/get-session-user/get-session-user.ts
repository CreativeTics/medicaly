import { UserRepository } from '../../../domain/user-repository'
import { GetSessionUserDto } from './get-session-user-dto'
import { InvalidSessionError } from './get-session-user-errors'
import { GetSessionUserResponse } from './get-session-user-response'
import { JwtService, JwtTokenPayload } from '../../../../../shared/infrastructure/services/jwt'
import { TokenBlacklist } from '../../../../../shared/infrastructure/databases/util/auth-sessions'

export class GetSessionUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: GetSessionUserDto): Promise<GetSessionUserResponse> {
    if (TokenBlacklist.instance.isRevoked(dto.token)) {
      throw new InvalidSessionError()
    }

    let payload: JwtTokenPayload
    try {
      payload = await JwtService.verify(dto.token)
    } catch {
      throw new InvalidSessionError()
    }

    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      type: payload.type,
      relations: payload.relations,
    }
  }
}
