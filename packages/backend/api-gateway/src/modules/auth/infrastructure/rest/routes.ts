import { Router } from 'express'
import { LoginController } from './controllers/login'
import { LoginUseCase } from '../../application/use-cases/login'
import { CouchUserRepository } from '../repositories/couch-user-repository'
import { getSessionUserController } from './controllers/get-session-user'
import { GetSessionUserUseCase } from '../../application/use-cases/get-session-user'
import { LogoutController } from './controllers/logout'
import { LogoutUseCase } from '../../application/use-cases/logout'
import { CreateUserController } from './controllers/create-user'
import { CreateUserUseCase } from '../../application/use-cases/create'
import { UpdateUserController } from './controllers/update-user'
import { UpdateUserUseCase } from '../../application/use-cases/update'
import { AuthSessions } from '../../../../shared/infrastructure/databases/util/auth-sessions'

export function publicAuthRoutes(): Router {
  const router: Router = Router()
  router.post('/login', async (req, res) =>
    new LoginController(new LoginUseCase(new CouchUserRepository())).execute(
      req,
      res
    )
  )
  router.post('/logout', (req, res) => {
    new LogoutController(new LogoutUseCase()).execute(req, res)
  })

  return router
}

export function AuthRoutes(): Router {
  const router: Router = Router()

  router.get('/sessions', (_, res) => {
    res.json(AuthSessions.instance.list())
  })

  router.get('/session', (req, res) => {
    new getSessionUserController(
      new GetSessionUserUseCase(new CouchUserRepository())
    ).execute(req, res)
  })

  router.delete('/session/:token', (req, res) => {
    const { token } = req.params
    AuthSessions.instance.delete(token)
    res.status(200).json({ message: 'Session deleted' })
  })

  router.post('/user/', (req, res) => {
    new CreateUserController(
      new CreateUserUseCase(new CouchUserRepository())
    ).execute(req, res)
  })

  router.put('/user/', (req, res) => {
    new UpdateUserController(
      new UpdateUserUseCase(new CouchUserRepository())
    ).execute(req, res)
  })

  return router
}
