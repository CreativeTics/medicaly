import { Router } from 'express'
import { GetPatientHistory } from './controllers/get-patient-history'
import { GetPatientHistoryUseCase } from '../../application/use-cases/history'
import { MixedPatientRepository } from '../repositories/mixed-patient-repository'

export function PatientRoutes(): Router {
  const router: Router = Router()
  router.get('/:id/history', async (req, res) =>
    new GetPatientHistory(
      new GetPatientHistoryUseCase(new MixedPatientRepository())
    ).execute(req, res)
  )
  return router
}
