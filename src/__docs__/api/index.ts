import { JsonObject } from 'swagger-ui-express'
import packageJson from '../../../package.json'
import { HOST } from '../../utils/config'
import { tags } from './tags'

const basePath = '/v1'
const host = HOST
const termsOfService = ''

/******************************************************************************
 * @returns JSON formatted with OpenAPI JSON specs.
 *****************************************************************************/
const openApi: JsonObject = {
  'swagger': '2.0',
  'info': {
    'description': packageJson?.description,
    'version': packageJson?.version,
    'title': packageJson?.name,
    'termsOfService': termsOfService,
    'contact': {
      'email': packageJson?.author
    },
    'license': {
      'name': packageJson.license,
      // 'url': 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  'host': host,
  'basePath': basePath,
  'tags': tags, // include
  'schemes': [
    'https',
    'http'
  ],
  'paths': paths, // include
  /* 'securityDefinitions': {
    'api_key': {
      'type': 'apiKey',
      'name': 'api_key',
      'in': 'header'
    },
    'petstore_auth': {
      'type': 'oauth2',
      'authorizationUrl': 'https://petstore.swagger.io/oauth/authorize',
      'flow': 'implicit',
      'scopes': {
        'read:pets': 'read your pets',
        'write:pets': 'modify pets in your account'
      }
    }
  }, */
  /* 'definitions': {
    'ApiResponse': {
      'type': 'object',
      'properties': {
        'code': {
          'type': 'integer',
          'format': 'int32'
        },
        'type': {
          'type': 'string'
        },
        'message': {
          'type': 'string'
        }
      }
    },
    'Category': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'name': {
          'type': 'string'
        }
      },
      'xml': {
        'name': 'Category'
      }
    },
    'Pet': {
      'type': 'object',
      'required': [
        'name',
        'photoUrls'
      ],
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'category': {
          '$ref': '#/definitions/Category'
        },
        'name': {
          'type': 'string',
          'example': 'doggie'
        },
        'photoUrls': {
          'type': 'array',
          'xml': {
            'wrapped': true
          },
          'items': {
            'type': 'string',
            'xml': {
              'name': 'photoUrl'
            }
          }
        },
        'tags': {
          'type': 'array',
          'xml': {
            'wrapped': true
          },
          'items': {
            'xml': {
              'name': 'tag'
            },
            '$ref': '#/definitions/Tag'
          }
        },
        'status': {
          'type': 'string',
          'description': 'pet status in the store',
          'enum': [
            'available',
            'pending',
            'sold'
          ]
        }
      },
      'xml': {
        'name': 'Pet'
      }
    },
    'Tag': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'name': {
          'type': 'string'
        }
      },
      'xml': {
        'name': 'Tag'
      }
    },
    'Order': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'petId': {
          'type': 'integer',
          'format': 'int64'
        },
        'quantity': {
          'type': 'integer',
          'format': 'int32'
        },
        'shipDate': {
          'type': 'string',
          'format': 'date-time'
        },
        'status': {
          'type': 'string',
          'description': 'Order Status',
          'enum': [
            'placed',
            'approved',
            'delivered'
          ]
        },
        'complete': {
          'type': 'boolean'
        }
      },
      'xml': {
        'name': 'Order'
      }
    },
    'User': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'username': {
          'type': 'string'
        },
        'firstName': {
          'type': 'string'
        },
        'lastName': {
          'type': 'string'
        },
        'email': {
          'type': 'string'
        },
        'password': {
          'type': 'string'
        },
        'phone': {
          'type': 'string'
        },
        'userStatus': {
          'type': 'integer',
          'format': 'int32',
          'description': 'User Status'
        }
      },
      'xml': {
        'name': 'User'
      }
    }
  }, */
  /* 'externalDocs': {
    'description': 'Find out more about Swagger',
    'url': 'http://swagger.io'
  } */
}

export default openApi
