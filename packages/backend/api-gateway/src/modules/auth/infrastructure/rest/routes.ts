import { Router } from 'express'
import { LoginController } from './controllers/login'
import { LoginUseCase } from '../../application/use-cases/login'
import { CouchUserRepository } from '../repositories/couch-user-repository'
import { getSessionUserController } from './controllers/get-session-user'
import { GetSessionUserUseCase } from '../../application/use-cases/get-session-user'
import { LogoutController } from './controllers/logout'
import { LogoutUseCase } from '../../application/use-cases/logout'

export function AuthRoutes(): Router {
  const router: Router = Router()
  router.post('/login', async (req, res) =>
    new LoginController(new LoginUseCase(new CouchUserRepository())).execute(
      req,
      res
    )
  )

  router.get('/session', (req, res) => {
    new getSessionUserController(
      new GetSessionUserUseCase(new CouchUserRepository())
    ).execute(req, res)
  })

  router.post('/logout', (req, res) => {
    new LogoutController(new LogoutUseCase()).execute(req, res)
  })

  return router
}
