import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

const port = process.env.PORT || 3000

app.get('/api/informed-consent', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
