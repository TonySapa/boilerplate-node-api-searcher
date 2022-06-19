import cors from 'cors'
import express from 'express'
import { info } from './utils/logger'
import { tokenExtractor } from './middlewares/authentication'
import firmsRouter from './controllers/firms'
import userRouter from './controllers/users'
import entriesRouter from './controllers/entries'
import { engine } from 'express-handlebars'
import { errorHandler } from './middlewares/error_handling'
import swaggerUi from 'swagger-ui-express'
import apiDocumentation from './docs/api'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use(errorHandler)
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/ping', (_req, res) => {
  info('someone pinged here')
  res.send('pong')
})

app.use('/api/firms', firmsRouter, errorHandler)
app.use('/api/users', userRouter)
app.use('/api/entries', entriesRouter, errorHandler)

/******************************************************************************
 * API documentation.
 *****************************************************************************/
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/api-docs', swaggerUi.serve)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.get('/api-docs', swaggerUi.setup(apiDocumentation)) // eslint-disable-line @typescript-eslint/no-unsafe-argument
 
export default app
