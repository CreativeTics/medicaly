import { Request, Response } from 'express'
import { UpdateUserUseCase } from '../../../application/use-cases/update'

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async execute(req: Request, res: Response) {
    const { id, password, roleId } = req.body
    try {
      const result = await this.updateUserUseCase.execute({
        id,
        password,
        roleId,
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
