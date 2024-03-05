import { Request, Response } from 'express'

import { CreateUserUseCase } from '../../../application/use-cases/create'

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(req: Request, res: Response) {
    const { username, password, roleId, type } = req.body
    try {
      const result = await this.createUserUseCase.execute({
        username,
        password,
        roleId,
        type,
      })

      res.json(result)
    } catch (error) {
      if (error.type === 'user') {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
