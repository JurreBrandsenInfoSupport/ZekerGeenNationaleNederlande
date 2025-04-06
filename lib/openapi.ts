import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Insurance Platform API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Insurance Platform application',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      components: {
        schemas: {
          Policy: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The policy ID',
              },
              policyNumber: {
                type: 'string',
                description: 'The policy number',
              },
              customerId: {
                type: 'integer',
                description: 'The customer ID',
              },
              customer: {
                type: 'string',
                description: 'The customer name',
              },
              type: {
                type: 'string',
                description: 'The policy type',
                enum: ['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Health Insurance'],
              },
              premium: {
                type: 'number',
                description: 'The annual premium amount',
              },
              startDate: {
                type: 'string',
                format: 'date',
                description: 'The policy start date',
              },
              endDate: {
                type: 'string',
                format: 'date',
                description: 'The policy end date',
              },
              status: {
                type: 'string',
                description: 'The policy status',
                enum: ['active', 'pending', 'expired', 'cancelled'],
              },
              coverageDetails: {
                type: 'object',
                description: 'The policy coverage details',
              },
            },
          },
          Claim: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The claim ID',
              },
              claimId: {
                type: 'string',
                description: 'The claim number',
              },
              policyNumber: {
                type: 'string',
                description: 'The associated policy number',
              },
              customerId: {
                type: 'integer',
                description: 'The customer ID',
              },
              customer: {
                type: 'string',
                description: 'The customer name',
              },
              amount: {
                type: 'number',
                description: 'The claim amount',
              },
              incidentDate: {
                type: 'string',
                format: 'date',
                description: 'The date of the incident',
              },
              filedDate: {
                type: 'string',
                format: 'date',
                description: 'The date the claim was filed',
              },
              status: {
                type: 'string',
                description: 'The claim status',
                enum: ['pending', 'processing', 'approved', 'rejected'],
              },
              description: {
                type: 'string',
                description: 'The claim description',
              },
              documents: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of document references',
              },
            },
          },
          Customer: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The customer ID',
              },
              name: {
                type: 'string',
                description: 'The customer name',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'The customer email',
              },
              phone: {
                type: 'string',
                description: 'The customer phone number',
              },
              customerSince: {
                type: 'string',
                format: 'date',
                description: 'The date the customer joined',
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    description: 'Street address',
                  },
                  city: {
                    type: 'string',
                    description: 'City',
                  },
                  state: {
                    type: 'string',
                    description: 'State',
                  },
                  zipCode: {
                    type: 'string',
                    description: 'ZIP code',
                  },
                },
              },
              policies: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of policy numbers',
              },
              claims: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of claim numbers',
              },
              avatar: {
                type: 'string',
                description: 'Avatar image URL',
              },
            },
          },
          PaginationInfo: {
            type: 'object',
            properties: {
              currentPage: {
                type: 'integer',
                description: 'Current page number',
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
              },
              pageSize: {
                type: 'integer',
                description: 'Number of items per page',
              },
              totalItems: {
                type: 'integer',
                description: 'Total number of items',
              },
              hasNextPage: {
                type: 'boolean',
                description: 'Whether there is a next page',
              },
              hasPreviousPage: {
                type: 'boolean',
                description: 'Whether there is a previous page',
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
              },
            },
          },
          Payment: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The payment ID',
              },
              paymentId: {
                type: 'string',
                description: 'The payment reference',
              },
              customerId: {
                type: 'integer',
                description: 'The customer ID',
              },
              customer: {
                type: 'string',
                description: 'The customer name',
              },
              amount: {
                type: 'number',
                description: 'The payment amount',
              },
              currency: {
                type: 'string',
                description: 'The payment currency',
              },
              date: {
                type: 'string',
                format: 'date',
                description: 'The payment date',
              },
              method: {
                type: 'string',
                description: 'The payment method',
                enum: ['bank_transfer', 'credit_card', 'check', 'direct_debit'],
              },
              status: {
                type: 'string',
                description: 'The payment status',
                enum: ['completed', 'pending', 'failed', 'cancelled'],
              },
              description: {
                type: 'string',
                description: 'The payment description',
              },
              referenceNumber: {
                type: 'string',
                description: 'The payment reference number',
              },
            },
          },
          PaymentCreate: {
            type: 'object',
            required: ['customerId', 'customer', 'amount', 'currency', 'date', 'method'],
            properties: {
              customerId: {
                type: 'integer',
                description: 'The customer ID',
              },
              customer: {
                type: 'string',
                description: 'The customer name',
              },
              amount: {
                type: 'number',
                description: 'The payment amount',
              },
              currency: {
                type: 'string',
                description: 'The payment currency',
              },
              date: {
                type: 'string',
                format: 'date',
                description: 'The payment date',
              },
              method: {
                type: 'string',
                description: 'The payment method',
                enum: ['bank_transfer', 'credit_card', 'check', 'direct_debit'],
              },
              description: {
                type: 'string',
                description: 'The payment description',
              },
            },
          },
          PaymentUpdate: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'The payment amount',
              },
              currency: {
                type: 'string',
                description: 'The payment currency',
              },
              date: {
                type: 'string',
                format: 'date',
                description: 'The payment date',
              },
              method: {
                type: 'string',
                description: 'The payment method',
                enum: ['bank_transfer', 'credit_card', 'check', 'direct_debit'],
              },
              status: {
                type: 'string',
                description: 'The payment status',
                enum: ['completed', 'pending', 'failed', 'cancelled'],
              },
              description: {
                type: 'string',
                description: 'The payment description',
              },
            },
          },
        },
        parameters: {
          page: {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          pageSize: {
            name: 'pageSize',
            in: 'query',
            description: 'Number of items per page',
            schema: {
              type: 'integer',
              default: 10,
            },
          },
          search: {
            name: 'search',
            in: 'query',
            description: 'Search term to filter results',
            schema: {
              type: 'string',
            },
          },
          sortField: {
            name: 'sortField',
            in: 'query',
            description: 'Field to sort results by',
            schema: {
              type: 'string',
            },
          },
          sortDirection: {
            name: 'sortDirection',
            in: 'query',
            description: 'Direction to sort results',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
          },
        },
        responses: {
          Unauthorized: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          NotFound: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          BadRequest: {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          InternalServerError: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
