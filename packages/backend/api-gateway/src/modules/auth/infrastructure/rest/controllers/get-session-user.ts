import { Request, Response } from 'express'

import { AuthSessions } from '../../../../../shared/infrastructure/databases/util/auth-sessions'
import {
  GetSessionUserUseCase,
  InvalidSessionError,
} from '../../../application/use-cases/get-session-user/'

export class getSessionUserController {
  constructor(private getSessionUserUseCase: GetSessionUserUseCase) {}

  async execute(req: Request, res: Response) {
    const { authorization } = req.headers
    try {
      AuthSessions.instance.get(authorization)

      const session = await this.getSessionUserUseCase.execute({
        token: authorization,
      })

      res.json(session)
    } catch (error) {
      if (error instanceof InvalidSessionError) {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
