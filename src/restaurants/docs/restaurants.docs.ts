import { create } from "domain";

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

export const RestaurantsDocsApiBody = {
  createRestaurant: {
    description: 'Data required to create a new restaurant',
    schema: {
      type: 'object',
      properties: {
        placeData: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Delicious Bites' },
            description: { type: 'string', example: 'A family-friendly restaurant with diverse menu options.' },
            location: { type: 'string', example: 'Downtown, Main Street 123' },
            email: { type: 'string', format: 'email', example: 'contact@deliciousbites.com' },
            phone: { type: 'string', example: '+1234567890' },
            website: { type: 'string', example: 'https://deliciousbites.com' },
            rating: { type: 'string', example: '4.5' },
            place_types: { type: 'string', example: 'restaurant,cafe' },
            currency: { type: 'string', example: 'USD' }
          },
          required: ['name', 'location']
        },
        restaurantData: {
          type: 'object',
          properties: {
            cuisine_type: { type: 'string', example: 'Italian' }
          },
          required: ['cuisine_type']
        },
        menuItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Spaghetti Carbonara' },
              type: { type: 'string', example: 'Main Course' },
              unit_price: { type: 'number', example: 15.99 },
              unit_text: { type: 'string', example: 'per serving' }
            }
          }
        },
        tables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              table_name: { type: 'string', example: 'Table 1' },
              seating_capacity: { type: 'number', example: 4 },
              is_available: { type: 'boolean', example: true },
              deposit: { type: 'number', example: 10.00 }
            }
          }
        }
      },
      required: ['placeData', 'restaurantData']
    },
    example: {
      placeData: {
        name: 'Delicious Bites',
        description: 'A family-friendly restaurant with diverse menu options.',
        location: 'Downtown, Main Street 123',
        email: 'contact@deliciousbites.com',
        phone: '+1234567890',
        website: 'https://deliciousbites.com',
        rating: '4.5',
        place_types: 'restaurant,cafe',
        currency: 'USD'
      },
      restaurantData: {
        cuisine_type: 'Italian'
      },
      menuItems: [
        {
          name: 'Spaghetti Carbonara',
          type: 'Main Course',
          unit_price: 15.99,
          unit_text: 'per serving'
        },
        {
          name: 'Tiramisu',
          type: 'Dessert',
          unit_price: 8.99,
          unit_text: 'per serving'
        }
      ],
      tables: [
        {
          table_name: 'Table 1',
          seating_capacity: 4,
          is_available: true,
          deposit: 10.00
        },
        {
          table_name: 'Table 2',
          seating_capacity: 6,
          is_available: true,
          deposit: 15.00
        }
      ]
    }
  },
  updateRestaurant: {
    description: 'Data to update an existing restaurant',
    schema: {
      type: 'object',
      properties: {
        placeData: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Restaurant Name' },
            description: { type: 'string', example: 'Updated description' },
            location: { type: 'string', example: 'Updated location' },
            rating: { type: 'string', example: '4.8' },
            currency: { type: 'string', example: 'EUR' }
          }
        },
        restaurantData: {
          type: 'object',
          properties: {
            cuisine_type: { type: 'string', example: 'French' }
          }
        }
      }
    },
    example: {
      placeData: {
        name: 'Ristorante Italiano',
        description: 'Authentic Italian cuisine in a rustic setting',
        rating: '4.8'
      },
      restaurantData: {
        cuisine_type: 'Southern Italian'
      }
    }
  },
  createMenuItem: {
    description: 'Data to create a new menu item',
    schema: {
      type: 'object',
      properties: {
        restaurant_id: { type: 'string', example: 'abc-123-def-456' },
        name: { type: 'string', example: 'Margherita Pizza' },
        type: { type: 'string', example: 'Main Course' },
        unit_price: { type: 'number', example: 12.99 },
        unit_text: { type: 'string', example: 'per pizza' }
      },
      required: ['restaurant_id', 'name', 'unit_price']
    },
    example: {
      restaurant_id: 'abc-123-def-456',
      name: 'Margherita Pizza',
      type: 'Main Course',
      unit_price: 12.99,
      unit_text: 'per pizza'
    }
  },
  updateMenuItem: {
    description: 'Data to update an existing menu item',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Deluxe Margherita Pizza' },
        type: { type: 'string', example: 'Specialty Pizza' },
        unit_price: { type: 'number', example: 15.99 },
        unit_text: { type: 'string', example: 'per pizza' }
      }
    },
    example: {
      name: 'Deluxe Margherita Pizza',
      unit_price: 15.99,
      type: 'Specialty Pizza'
    }
  },
  createTable: {
    description: 'Data to create a new restaurant table',
    schema: {
      type: 'object',
      properties: {
        restaurant_id: { type: 'string', example: 'abc-123-def-456' },
        table_name: { type: 'string', example: 'Window Table 3' },
        seating_capacity: { type: 'number', example: 6 },
        is_available: { type: 'boolean', example: true },
        deposit: { type: 'number', example: 20.00 }
      },
      required: ['restaurant_id', 'table_name', 'seating_capacity']
    },
    example: {
      restaurant_id: 'abc-123-def-456',
      table_name: 'Window Table 3',
      seating_capacity: 6,
      is_available: true,
      deposit: 20.00
    }
  },
  updateTable: {
    description: 'Data to update an existing restaurant table',
    schema: {
      type: 'object',
      properties: {
        table_name: { type: 'string', example: 'VIP Table 1' },
        seating_capacity: { type: 'number', example: 8 },
        is_available: { type: 'boolean', example: false },
        deposit: { type: 'number', example: 50.00 }
      }
    },
    example: {
      table_name: 'VIP Table 1',
      seating_capacity: 8,
      is_available: false,
      deposit: 50.00
    }
  }
};