import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 3001
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST
  : process.env.NODE_ENV === 'development'
    ? process.env.MONGODB_URI_DEV
    : process.env.MONGODB_URI_PRO
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.ticktax.io/api'
  : 'http:localhost:3000/api'
