const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'CongChungOnline API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
  components: {
    schemas: {
      Notarizations: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                },
                firebaseUrl: {
                  type: 'string',
                },
              },
            },
          },
          notaryService: {
            type: 'string',
          },
          notaryField: {
            type: 'string',
          },
          requesterInfo: {
            type: 'object',
            properties: {
              citizenId: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              email: {
                type: 'string',
              },
            },
          },
          userId: {
            type: 'string',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
      },
      Forbidden: {
        description: 'Forbidden',
      },
      NotFound: {
        description: 'Not Found',
      },
    },
  },
};

module.exports = swaggerDef;
