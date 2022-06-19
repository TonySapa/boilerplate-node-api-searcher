import routes, { endpointsDescriptions, routesDescriptions } from '../../controllers'
import { ApiParameterOpenAPI, Endpoint } from '../../types/index'

const deleteDemo = (
  parameters: Array<ApiParameterOpenAPI> | undefined,
  router: string,
  summary: string
) => ({
  'tags': [
    router || 'others'
  ],
  'summary': summary || '',
  'description': '',
  'operationId': '', // 'uploadFile',
  /* 'consumes': [
    'multipart/form-data'
  ], */
  'produces': [
    'application/json'
  ],
  'parameters': parameters,
  'responses': {
    '200': {
      'description': 'successful operation',
      'schema': {
        '$ref': '#/definitions/ApiResponse'
      }
    }
  },
  'security': [
    {
      'petstore_auth': [
        'write:pets',
        'read:pets'
      ]
    }
  ]
})

interface ExternalDocsTagOpenAPI {
  description?: string
  url?: string
}

export interface TagOpenAPI {
  name: string
  description?: string
  externalDocs?: ExternalDocsTagOpenAPI // Not useful right now, not included.
} 

/******************************************************************************
 * Reads information from index file on controllers folders and retrieves all
 * routers information needed to make assumptions about tags of the
 * routes following OpenAPI specification.
 * @returns {Array<TagOpenAPI>} parsedTags.
 *****************************************************************************/
export const parsedTags: Array<TagOpenAPI> =
  Object.entries(routesDescriptions).map((route): TagOpenAPI => ({
  name: route[0],
  description: route[1]
}))

/******************************************************************************
 * Reads information from index file on controllers folders and retrieves all
 * routers information needed to make assumptions about paths and all extended
 * information needed on OpenAPI specification JSON for "paths" field.
 * @returns {Array<TagOpenAPI>} parsedTags.
 *****************************************************************************/
export const parsedPaths = Object.values(
  Object.entries(routes).map((route) => {
    const arrayFormated = route[1].stack
      .filter((r: { route: unknown }) => r.route)
      .map((r: { route: { methods: Record<string, unknown>; path: never } }) => {
        const restMethod = Object.keys(r.route.methods)[0]
        const routerName = route[0].slice(0, -6)
        const routeUrl = `/${routerName}${r.route.path}`
        const endpointDescription: Endpoint | undefined = endpointsDescriptions
          .find((endpoint) => endpoint.method === restMethod &&
            endpoint.route === r.route.path
          )
        const parameters = endpointDescription?.parameters
        const summary = endpointDescription?.description || ''

        return {
          [routeUrl]: {
            [restMethod]: deleteDemo(parameters, routerName, summary)
          }
        }
      })

    return arrayFormated
  })
    .flat()
)

