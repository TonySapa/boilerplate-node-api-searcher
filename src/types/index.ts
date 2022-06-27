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

export type StatusCode = 200 | 201 | 400 | 401 | 402 | 404

export interface TagOpenAPI {
  name?: string
  description?: string
  externalDocs?: {
    description?: string
    url?: string
  }
}

export interface ResponseSchemaOpenAPI {
  type: 'string' | 'object' | 'integer'
  example: string
}

export interface Response {
  description: string
  schema: ResponseSchemaOpenAPI
}

export type Endpoint = {
  route: string
  method: 'get' | 'put' | 'post' | 'delete' | 'patch'
  description: string
  parameters?: Array<ApiParameterOpenAPI>
  responses: Array<Response> | []
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
