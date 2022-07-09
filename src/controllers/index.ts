import { aboutRouter as aboutEntriesRouter } from './entries/__docs__'
import entriesRouter from './entries'
import firmsRouter, { routeDescription as firmsDescription } from './firms'
import usersRouter, { routeDescription as usersDescription } from './users'

/******************************************************************************
 * Used for generating documentation in OpenAPI specification automatically.
 * Inferring tags descriptions. In order to avoid an extra iteration is
 * important to order its fields exactly as the default export.
 *****************************************************************************/
export const routesDescriptions = {
  entries: aboutEntriesRouter.description,
  firms: firmsDescription,
  users: usersDescription
}

/******************************************************************************
 * Used for generating documentation in OpenAPI specification automatically.
 * Inferring information about "path" field on OpenAPI.
 *****************************************************************************/
export const endpointsDescriptions = [
  ...aboutEntriesRouter.endpoints
]

/******************************************************************************
 * Exports information about the existing routers and endpoints. Used to
 * automatically generate documentation of the API following OpenAPI specs.
 *****************************************************************************/
export default {
  entriesRouter,
  firmsRouter,
  usersRouter
}
