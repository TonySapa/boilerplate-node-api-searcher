import jwt from 'jsonwebtoken'

declare module 'jsonwebtoken' {
  // eslint-disable-next-line no-unused-vars
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    email: string
    token?: string
  }
}

declare module 'express' { 
  export interface Request {
    token?: string
  }
}
