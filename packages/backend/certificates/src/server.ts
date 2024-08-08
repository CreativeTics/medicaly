import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { GenerateCertificateController } from './controllers/generate-certificate'
import { GetFileController } from './controllers/get-file'
import { GenerateMedicalHistoryController } from './controllers/generate-medical-history'

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

app.get('/api/health', (req, res) => {
  res.send('OK')
  res.end()
})

app.get('/api/medical-history/:orderId', async (req, res) => {
  console.log(
    'Received request to get html view of  medical history',
    req.params.orderId
  )

  const html =
    await new GenerateMedicalHistoryController().getRenderedHtmlMedicalHistory(
      req.params.orderId
    )

  res.send(html)
  res.end()
})

// app.post('/api/medical-history/', async (req, res) => {
//   console.log('Received request to generate medical - history', req.body)

//   const certificateId = await new GenerateMedicalHistoryController().execute(
//     req.body.order
//   )

//   res.send(certificateId)
//   res.end()
// })

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

  const certificate = await new GetFileController().execute(req.params.id, {
    transform: req.query?.transform?.toString(),
  })

  if (req.query.transform === 'image') {
    res.setHeader('Content-Type', 'image/png')
  }

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
