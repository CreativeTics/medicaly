import express from 'express'

import httpProxy from 'express-http-proxy'

const app = express()

app.use(
  '/db',
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

app.listen(4000, () => {
  console.log('API Gateway listening on port 4000')
})
