import express, { json } from 'express'

import httpProxy from 'express-http-proxy'

import { AuthRoutes } from './modules/auth/infrastructure/rest/routes'
import { AuthSessions } from './shared/infrastructure/databases/util/auth-sessions'

const app = express()

app.use(
  json({
    limit: '500mb',
  })
)

app.use(
  '/db',
  (req, res, next) => {
    if (!AuthSessions.instance.validate(req.headers.authorization)) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    next()
  },
  httpProxy('http://localhost:5984', {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers['Authorization'] =
        'Basic ' + Buffer.from('4dm1n-us3r:4dm1n-p4ssw0rd!!').toString('base64')
      // you can change the method
      //   proxyReqOpts.method = 'GET';
      return proxyReqOpts
    },
  })
)

app.use('/api/v1/auth', AuthRoutes())

app.listen(4000, () => {
  console.log('API Gateway listening on port 4000')
})
