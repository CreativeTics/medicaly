import { TokenBlacklist } from '../../../../../shared/infrastructure/databases/util/auth-sessions'
import { LogoutDto } from './logout-dto'

export class LogoutUseCase {
  constructor() {}

  async execute(dto: LogoutDto): Promise<void> {
    TokenBlacklist.instance.revoke(dto.token)
  }
}
