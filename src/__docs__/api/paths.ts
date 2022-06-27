type PathOpenAPI = {
  tags?: [string]
  summary?: string,
  description?: string,
  operationId?: string,
  consumes?: [
    'multipart/form-data'
  ],
  produces?: [
    'application/json'
  ],
  parameters?: [
    {
      name?: 'petId',
      in?: 'path',
      description?: 'ID of pet to update',
      required?: true,
      type?: 'integer',
      format?: 'int64'
    },
    {
      name?: 'additionalMetadata',
      in?: 'formData',
      description?: 'Additional data to pass to server',
      required?: false,
      type?: 'string'
    },
    {
      name?: 'file',
      in?: 'formData',
      description?: 'file to upload',
      required?: false,
      type?: 'file'
    }
  ],
  responses?: {
    200?: {
      description?: 'successful operation',
      schema?: {
        $ref?: '#/definitions/ApiResponse'
      }
    }
  },
  security?: [
    {
      petstore_auth?: [
        'write?:pets',
        'read?:pets'
      ]
    }
  ]
}

interface PathsOpenAPI {
  get?: PathOpenAPI
  post?: PathOpenAPI
  put?: PathOpenAPI
  delete?: PathOpenAPI
}

type RouteInit = {
  route: string
  tags: [string]
  summary?: string
}

export const getPath = ({
  route,
  tags,
  summary
}: RouteInit): PathsOpenAPI => {
  return ({
    [route]: {
      tags: tags,
      summary: summary,
      /* description: '',
      operationId: 'uploadFile',
      consumes: [
        'multipart/form-data'
      ],
      produces: [
        'application/json'
      ],
      parameters: [
        {
          name?: 'petId',
          in?: 'path',
          description?: 'ID of pet to update',
          required?: true,
          type?: 'integer',
          format?: 'int64'
        },
        {
          name?: 'additionalMetadata',
          in?: 'formData',
          description?: 'Additional data to pass to server',
          required?: false,
          type?: 'string'
        },
        {
          name?: 'file',
          in?: 'formData',
          description?: 'file to upload',
          required?: false,
          type?: 'file'
        }
      ],
      responses: {
        200?: {
          description?: 'successful operation',
          schema?: {
            $ref?: '#/definitions/ApiResponse'
          }
        }
      },
      security: [
        {
          petstore_auth?: [
            'write?:pets',
            'read?:pets'
          ]
        }
      ] */
    }
  })
}
