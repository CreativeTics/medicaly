import { Router } from 'express'
import { GetFile } from './controllers/get-file'
import { GetFileUseCase } from '../../application/use-cases/get-file'
import { CouchS3FileSyncRepository } from '../repositories/couch-s3-file-sync-repository'

export function FilesRoutes(): Router {
  const router: Router = Router()
  router.get('/:id', async (req, res) =>
    new GetFile(
      new GetFileUseCase(new CouchS3FileSyncRepository())
    ).execute(req, res)
  )
  return router
}
