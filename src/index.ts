import mongoose, { ConnectOptions } from 'mongoose'
import { MONGODB_URI } from './utils/config'
import { info, error as logError } from './utils/logger'
import app from './app'

mongoose.connect(
  `${MONGODB_URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    logError('error connection to MongoDB:', `${error.message}`)
  })

const PORT = 3000

/******************************************************************************
 * Wrapping on this "if statement" allows jest/supertest to runInBand and not
 * crash because of port already in use.
 *****************************************************************************/
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    info(`Server running on port ${PORT}`)
  })  
}

export default app
