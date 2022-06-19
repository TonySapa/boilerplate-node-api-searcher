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

export interface Endpoint {
  route: string
  method: 'get' | 'put' | 'post' | 'delete' | 'patch'
  description: string
  parameters?: Array<ApiParameterOpenAPI>
}

export type RouterDescription = {
  description: string
  endpoints: Array<Endpoint>
}

export interface ApiParameterOpenAPI {
  name: string
  in?: 'path' | 'query' | 'header' | 'cookie'
  description?: string
  required?: boolean
  type?: 'number' | 'string' | 'file'
}
