import { Request, Response } from 'express'
import { generateRipsReport } from '../../services/rips/generate-rips-report'

export class GetRipsReport {
  async execute(req: Request, res: Response) {
    try {
      const invoiceId = req.params.invoiceId
      if (invoiceId === undefined) {
        res.status(400).json({ message: 'Invalid invoiceId' })
        return
      }
      const format = (req.query.format as 'xlsx' | 'json') ?? 'json'

      const report = await generateRipsReport(invoiceId)

      if (format === 'json') {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${report.name}.json"`
        )
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(report.rips, null, 2))
      } else {
        res.status(400).json({ message: 'Unsupported format' })
      }

      // Do something with the response
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
