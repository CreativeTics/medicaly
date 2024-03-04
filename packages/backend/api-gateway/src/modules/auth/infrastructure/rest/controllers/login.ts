import { Request, Response } from 'express'

import {
  InvalidUsernameOrPasswordError,
  LoginUseCase,
} from '../../../application/use-cases/login'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async execute(req: Request, res: Response) {
    const { username, password } = req.body
    try {
      const token = await this.loginUseCase.execute({ username, password })

      res.json(token)
    } catch (error) {
      if (error instanceof InvalidUsernameOrPasswordError) {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
