import express from 'express'
import cors from 'cors'
import { connectDB } from './db/connect.js'
import { batchRouter } from './routes/batches.js'
import { sessionRouter } from './routes/sessions.js'
import { managementRouter } from './routes/management.js'
import { authRouter } from './routes/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/batches', batchRouter)
app.use('/sessions', sessionRouter)
app.use('/management', managementRouter)
app.use('/auth', authRouter)

app.listen(3000, async () => {
  console.log(`server is connected on port 3000`)
  await connectDB()
})