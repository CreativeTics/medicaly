import { Request, Response } from 'express'

export class GetRipsReport {
  async execute(req: Request, res: Response) {
    try {
      const invoiceId = Number(req.params.invoiceId)
      if (isNaN(invoiceId)) {
        res.status(400).json({ message: 'Invalid invoiceId' })
        return
      }
      const format = (req.query.format as 'xlsx' | 'json') ?? 'xlsx'

      // Do something with the response
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
