import { RouterDescription } from '../../types/index'

/******************************************************************************
 * Used to automatically parse documention data for OpenAPI docs tool. Should
 * contain content of every endpoint, otherwise documentation generated will
 * lack details.
 * @field description. Tells about controller.
 * @field endpoints. Contains info about each endpoint.
 *****************************************************************************/
export const aboutRouter: RouterDescription = {
  description: 'Demonstration endpoint template about CRUD operations',
  endpoints: [
    {
      route: '/ping',
      method: 'get',
      description: 'Health endpoint to monitor that the route is working'
    },
    {
      route: '/',
      method: 'get',
      description: 'Get all entries without filtering'
    },
    {
      route: '/',
      method: 'post',
      description: 'Creates a new entry'
    },
    {
      route: '/range/:min/:max',
      method: 'get',
      description: 'Get entries within a range',
      parameters: [
        {
          name: 'min',
          in: 'path',
          description: 'Used for pagination, represents the position in the array to slice from.',
          required: true,
          type: 'number'
        },
        {
          name: 'max',
          in: 'path',
          description: 'Used for pagination, represents the last position in the array to return',
          required: true,
          type: 'number'
        }
      ]
    },
    {
      route: '/:id',
      method: 'get',
      description: 'Find entry by id'
    },
    {
      route: '/:id',
      method: 'put',
      description: 'Update entry by id'
    },
    {
      route: '/:id',
      method: 'delete',
      description: 'Delete entry by id'
    }
  ]
}
