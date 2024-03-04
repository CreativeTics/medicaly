import { Request, Response } from 'express'
import { LogoutUseCase } from '../../../application/use-cases/logout'

export class LogoutController {
  constructor(private logoutUseCase: LogoutUseCase) {}

  async execute(req: Request, res: Response) {
    const { authorization } = req.headers
    try {
      await this.logoutUseCase.execute({ token: authorization })
      res.send('Logged out')
    } catch (error) {
      {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
