import express, { NextFunction, Request, Response, json } from 'express'
import { config } from 'dotenv'
config()

import cors from 'cors'
import morgan from 'morgan'

import httpProxy from 'express-http-proxy'

import { AuthRoutes } from './modules/auth/infrastructure/rest/routes'
import { AuthSessions } from './shared/infrastructure/databases/util/auth-sessions'
import { PatientRoutes } from './modules/patients/infrastructure/rest/routes'

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(morgan('tiny'))

app.use(
  json({
    limit: '500mb',
  })
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
  })
)

app.use(
  '/api/v1/files',
  validateAuth,
  httpProxy(process.env.CERTIFICATES_URL || 'http://certificates:3002')
)

app.use('/api/v1/auth', AuthRoutes())
app.use('/api/v1/patients', PatientRoutes())

app.listen(process.env.PORT || 4000, () => {
  console.log('API Gateway listening on port 4000')
})

function validateAuth(req: Request, res: Response, next: NextFunction) {
  const token =
    req.headers.authorization ||
    decodeURI(req.query.h?.toString()).replace(' ', '+')
  if (!AuthSessions.instance.validate(token)) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  next()
}
