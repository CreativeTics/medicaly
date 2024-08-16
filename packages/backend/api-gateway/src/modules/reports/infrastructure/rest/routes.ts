import { Router } from 'express'
import { GetBiReportUrl } from './controllers/get-bi-url'

export function ReportsRoutes(): Router {
  const router: Router = Router()
  router.get('/bi/:code', async (req, res) =>
    new GetBiReportUrl().execute(req, res)
  )
  return router
}
