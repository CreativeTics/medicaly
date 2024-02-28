import { Router } from 'express'
import { LoginController } from './controllers/login'
import { LoginUseCase } from '../../application/use-cases/login'
import { CouchUserRepository } from '../repositories/couch-user-repository'

export function AuthRoutes(): Router {
  const router: Router = Router()
  router.post('/login', async (req, res) =>
    new LoginController(new LoginUseCase(new CouchUserRepository())).execute(
      req,
      res
    )
  )

  return router
}
