import { Router } from 'express'
import { GetBiReportUrl } from './controllers/get-bi-url'
import { GetRipsReport } from './controllers/get-rips'

export function ReportsRoutes(): Router {
  const router: Router = Router()
  router.get('/bi/:code', async (req, res) =>
    new GetBiReportUrl().execute(req, res)
  )

  router.get('/rips/:invoiceId', async (req, res) => {
    // Do something with the response
    new GetRipsReport().execute(req, res)
  })

  return router
}
