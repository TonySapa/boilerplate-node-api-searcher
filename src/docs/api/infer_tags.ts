import /* routes */ { routesDescriptions } from '../../controllers/index'

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

/*
export const getTags: unknown = routes.entriesRouter.stack
  .filter((r: { route: unknown }) => r.route)
  .map((r: { route: { methods: Record<string, unknown>; path: never } }) => {
    return {
      method: Object.keys(r.route.methods)[0].toUpperCase(),
      path: r.route.path
    }
})
*/
