import { Request, Response } from 'express'
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token'

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async execute(req: Request, res: Response) {
    const token = req.headers.authorization

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const result = await this.refreshTokenUseCase.execute({ token })
      res.json(result)
    } catch (error: any) {
      if (
        error.message === 'Token revoked' ||
        error.message === 'Invalid token' ||
        error.message === 'User not found'
      ) {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
