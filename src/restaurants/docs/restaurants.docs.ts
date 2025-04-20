export const RestaurantsDocsApiResponse = {
  getAllRestaurants: {
    success: {
      status: 200,
      description: 'Retrieved all restaurants successfully.',
      schema: {
        example: [
          {
            id: '123',
            name: 'Restaurant A',
            rating: '4.5',
            cuisine_type: 'Italian',
            location: 'New York, NY',
          },
          {
            id: '456',
            name: 'Restaurant B',
            rating: '4.0',
            cuisine_type: 'Mexican',
            location: 'Los Angeles, CA',
          },
        ],
      },
    },
    serverError: {
      status: 500,
      description: 'Internal server error.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    },
  },
  getRestaurantById: {
    success: {
      status: 200,
      description: 'Retrieved restaurant successfully.',
      schema: {
        example: {
          id: '123',
          name: 'Restaurant A',
          description: 'A cozy Italian restaurant.',
          location: 'New York, NY',
          email: 'contact@restaurant-a.com',
          phone: '+1234567890',
          website: 'https://restaurant-a.com',
          rating: '4.5',
          cuisine_type: 'Italian',
          created_at: '2023-01-01T00:00:00Z',
        },
      },
    },
    notFound: {
      status: 404,
      description: 'Restaurant not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Restaurant not found',
        },
      },
    },
    serverError: {
      status: 500,
      description: 'Internal server error.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    },
  },
};