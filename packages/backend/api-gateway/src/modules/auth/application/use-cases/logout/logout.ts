import { AuthSessions } from '../../../../../shared/infrastructure/databases/util/auth-sessions'
import { LogoutDto } from './logout-dto'

export class LogoutUseCase {
  constructor() {}

  async execute(dto: LogoutDto): Promise<void> {
    AuthSessions.instance.delete(dto.token)
  }
}
