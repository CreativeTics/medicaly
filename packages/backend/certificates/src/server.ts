import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { GenerateAnnotationViewController } from './controllers/generate-annotation-view'
import { GenerateCertificateController } from './controllers/generate-certificate'
import { GenerateMedicalHistoryController } from './controllers/generate-medical-history'
import { GetFileController } from './controllers/get-file'

import { GenerateConsentController } from './controllers/generate-consent'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// cors
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.use(morgan('combined'))

const port = process.env.PORT || 3000

app.get('/api/health', (req, res) => {
  res.send('OK')
  res.end()
})

app.get('/api/medical-history/:orderId', async (req, res) => {
  console.log(
    'Received request to get html view of  medical history',
    req.params.orderId
  )

  const html = await new GenerateMedicalHistoryController().execute(
    req.params.orderId,
    req.query.h as string
  )

  res.send(html)
  res.end()
})

app.post('/api/certificates/', async (req, res) => {
  console.log('Received request to generate certificate', req.body)

  const certificate = await new GenerateCertificateController().execute(
    req.body.order,
    req.body.serviceId,
    req.body.examId
  )

  if (!certificate) {
    res.status(404).send('Certificate not found')
    res.end()
    return
  }

  res.setHeader('Content-Disposition', `inline; filename=${certificate.name}`)
  res.setHeader('Content-Type', certificate.mimeType) // 'application/pdf'
  res.setHeader('Content-Length', certificate.data.length)
  res.send(certificate.data)
  res.end()
})

app.get('/api/consent/:orderId/:consentTemplateId', async (req, res) => {
  console.log('Received request to generate consent', req.body)

  const consent = await new GenerateConsentController().execute(
    req.params.orderId,
    req.params.consentTemplateId
  )

  if (!consent) {
    res.status(404).send('Certificate not found')
    res.end()
    return
  }
  res.setHeader('Content-Disposition', `inline; filename=${consent.name}`)
  res.setHeader('Content-Type', consent.mimeType)
  res.send(consent.data)
  res.end()
})

app.get('/api/annotations/:orderId/:annotation', async (req, res) => {
  console.log(
    'Received request to get html view of  medical history',
    req.params.orderId
  )

  const html = await new GenerateAnnotationViewController().execute(
    req.params.orderId,
    req.params.annotation,
    req.query.h as string
  )

  res.send(html)
  res.end()
})

app.get('/api/files/:id', async (req, res) => {
  console.log('Received request to get file', req.params.id)

  const certificate = await new GetFileController().execute(req.params.id)

  // sanitize toUrlString
  const filename = certificate.fileName
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()

  res.setHeader('Content-Disposition', `inline; filename=${filename}`)
  res.setHeader('Content-Type', certificate.fileType)
  res.send(certificate.data)
  res.end()
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
