import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { GenerateCertificateController } from './controllers/generate-certificate'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
