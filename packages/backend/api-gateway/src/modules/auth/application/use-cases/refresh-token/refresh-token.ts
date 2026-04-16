import { UserRepository } from '../../../domain/user-repository'
import { RefreshTokenDto } from './refresh-token-dto'
import { RefreshTokenResponse } from './refresh-token-response'
import {
  JwtService,
  JwtTokenPayload,
} from '../../../../../shared/infrastructure/services/jwt'
import { TokenBlacklist } from '../../../../../shared/infrastructure/databases/util/auth-sessions'

export class RefreshTokenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    // Verify current token is valid and not blacklisted
    if (TokenBlacklist.instance.isRevoked(dto.token)) {
      throw new Error('Token revoked')
    }

    let payload: JwtTokenPayload
    try {
      payload = await JwtService.verify(dto.token)
    } catch {
      throw new Error('Invalid token')
    }

    // Re-read user from DB to get fresh permissions/role
    const user = await this.userRepository.getById(payload.sub)
    if (!user) {
      throw new Error('User not found')
    }

    // Blacklist the old token so it can't be reused
    const oldExpMs = (payload.exp ?? 0) * 1000
    TokenBlacklist.instance.revoke(dto.token, oldExpMs)

    // Issue new token with fresh user data
    const newToken = await JwtService.sign(user.tokenPayload)

    return { token: newToken }
  }
}
