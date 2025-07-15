import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ModArt API Documentation',
      version: '1.0.0',
      description: 'API documentation for ModArt application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Event: {
          type: 'object',
          required: ['title', 'description', 'start_date', 'end_date', 'location'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'événement'
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: 'Titre de l\'événement'
            },
            description: {
              type: 'string',
              description: 'Description de l\'événement'
            },
            start_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de début de l\'événement'
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de fin de l\'événement'
            },
            location: {
              type: 'string',
              description: 'Lieu de l\'événement'
            },
            isActive: {
              type: 'boolean',
              description: 'Statut actif de l\'événement',
              default: true
            },
            createdBy: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur'
            },
            updatedBy: {
              type: 'string',
              description: 'ID de l\'utilisateur qui a modifié en dernier'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification'
            }
          }
        },
        Project: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique du projet'
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: 'Titre du projet'
            },
            description: {
              type: 'string',
              description: 'Description du projet'
            },
            externalUrl: {
              type: 'string',
              format: 'uri',
              description: 'Lien externe vers le projet'
            },
            createdBy: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification'
            }
          }
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur'
            },
            name: {
              type: 'string',
              description: 'Nom complet de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur'
            },
            role: {
              type: 'string',
              enum: ['student', 'admin'],
              description: 'Rôle de l\'utilisateur',
              default: 'student'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification'
            }
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API routes and controllers
};

export const swaggerSpec = swaggerJsdoc(options); 