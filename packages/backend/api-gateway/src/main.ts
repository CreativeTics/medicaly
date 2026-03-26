import express, { NextFunction, Request, Response, json } from 'express'
import { config } from 'dotenv'
config()

import cors from 'cors'
import morgan from 'morgan'

import httpProxy from 'express-http-proxy'

import {
  AuthRoutes,
  publicAuthRoutes,
} from './modules/auth/infrastructure/rest/routes'
import { JwtService } from './shared/infrastructure/services/jwt'
import { TokenBlacklist } from './shared/infrastructure/databases/util/auth-sessions'
import { PatientRoutes } from './modules/patients/infrastructure/rest/routes'

import { ReportsRoutes } from './modules/reports/infrastructure/rest/routes'

const app = express()

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.ENABLE_LOCALHOST ? 'http://localhost:5173' : undefined,
    ].filter(Boolean),
    credentials: true,
  }),
)
app.use(morgan('tiny'))

app.use(
  json({
    limit: '500mb',
  }),
)

app.use(
  '/db',
  validateAuth,
  httpProxy(process.env.COUCHDB_URL || 'http://localhost:5984', {
    proxyReqOptDecorator: function (proxyReqOpts) {
      const couchCredentials = `${process.env.COUCHDB_USERNAME}:${process.env.COUCHDB_PASSWORD}`
      proxyReqOpts.headers['Authorization'] =
        'Basic ' + Buffer.from(couchCredentials).toString('base64')

      return proxyReqOpts
    },
  }) as any,
)

app.use(
  '/api/v1/files',
  validateAuth,
  httpProxy(process.env.CERTIFICATES_URL || 'http://certificates:3002') as any,
)
app.get('/.well-known/jwks.json', async (_req, res) => {
  try {
    const jwks = await JwtService.getJwks()
    res.json(jwks)
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.use('/api/v1/auth', publicAuthRoutes())
app.use('/api/v1/auth', validateAuth, AuthRoutes())
app.use('/api/v1/patients', validateAuth, PatientRoutes())
app.use('/api/v1/reports', validateAuth, ReportsRoutes())

app.listen(process.env.PORT || 4000, () => {
  console.log('API Gateway listening on port 4000')
})

async function validateAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization || req.query.h?.toString()

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (TokenBlacklist.instance.isRevoked(token)) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    await JwtService.verify(token)
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
