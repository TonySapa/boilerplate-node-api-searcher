import entriesRouter, { routeDescription as entriesDescription } from './entries'
import firmsRouter, { routeDescription as firmsDescription } from './firms'
import usersRouter, { routeDescription as usersDescription } from './users'

/******************************************************************************
 * Used for generating documentation in OpenAPI specification automatically.
 * Inferring tags descriptions. In order to avoid an extra iteration is
 * important to order its fields exactly as the default export.
 *****************************************************************************/
export const routesDescriptions = {
  entries: entriesDescription,
  firms: firmsDescription,
  users: usersDescription
}

/******************************************************************************
 * Exports information about the existing routers and endpoints. Used to
 * automatically generate documentation of the API following OpenAPI specs.
 *****************************************************************************/
export default {
  entriesRouter,
  firmsRouter,
  usersRouter
}
