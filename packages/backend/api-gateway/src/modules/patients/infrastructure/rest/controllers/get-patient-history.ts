import { Request, Response } from 'express'
import {
  GetPatientHistoryUseCase,
  PatientNotFoundError,
} from '../../../application/use-cases/history'

export class GetPatientHistory {
  constructor(private getPatientHistoryByDocument: GetPatientHistoryUseCase) {}

  async execute(req: Request, res: Response) {
    try {
      const patient = await this.getPatientHistoryByDocument.execute({
        id: req.params.id.toString(),
        contracts: req.query.contracts?.toString().split(',') || [],
      })

      res.json(patient)
    } catch (error) {
      if (error instanceof PatientNotFoundError) {
        res.status(404).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
