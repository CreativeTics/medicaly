import { Request, Response } from 'express'
import { generateRipsReport } from '../../services/rips/generate-rips-report'
import { transformRipsTransactionToXlsx } from '../../services/rips/transform-to-xlsx'

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

        const buffer = Buffer.from(JSON.stringify(report.rips, null, 2))
        res.setHeader('Content-Length', buffer.length)
        res.status(200).send(buffer)
      } else if (format === 'xlsx') {
        const reportXlsx = transformRipsTransactionToXlsx(report.rips)
        const buffer = await reportXlsx.xlsx.writeBuffer()
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${report.name}.xlsx"`
        )
        res.setHeader('Content-Length', buffer.byteLength)
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.status(200).send(buffer)
      } else {
        res.status(400).json({ message: 'Invalid format' })
      }

      // Do something with the response
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
