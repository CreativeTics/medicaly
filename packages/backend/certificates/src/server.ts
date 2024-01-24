import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { GenerateCertificateController } from './controllers/generate-certificate'
import { GetFileController } from './controllers/get-file'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.use(morgan('combined'))

const port = process.env.PORT || 3000

app.post('/api/certificates/', async (req, res) => {
  console.log('Received request to generate certificate', req.body)

  const certificateId = await new GenerateCertificateController().execute(
    req.body.order,
    req.body.code
  )

  res.send(certificateId)
  res.end()
})

app.get('/api/files/:id', async (req, res) => {
  console.log('Received request to get file', req.params.id)

  const certificate = await new GetFileController().execute(req.params.id)

  res.setHeader(
    'Content-Disposition',
    `inline; filename=${certificate.fileName}`
  )
  res.setHeader('Content-Type', certificate.fileType)
  res.send(certificate.data)
  res.end()
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
