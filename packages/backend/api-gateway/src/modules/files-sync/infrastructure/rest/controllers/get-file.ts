import { Request, Response } from 'express'
import {
  GetFileUseCase,
  FileNotFoundError,
} from '../../../application/use-cases/get-file'

export class GetFile {
  constructor(private getFileUseCase: GetFileUseCase) {}

  async execute(req: Request, res: Response) {
    try {
      const file = await this.getFileUseCase.execute({
        fileId: req.params.id.toString(),
      })

      res.setHeader('Content-Type', file.contentType)
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${file.fileName}"`
      )
      res.send(file.data)
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        res.status(404).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}
