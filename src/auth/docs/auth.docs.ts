export const AuthDocsApiResponse = {
  signUp: {
    success: {
      status: 201,
      description: 'Sign up successful',
      schema: {
        example: {
          message: 'Sign up successful',
          data: {
            user: {
              id: 'a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p',
              email: 'user@example.com',
              app_metadata: {
                provider: 'email'
              },
              user_metadata: {},
              aud: 'authenticated'
            },
            session: null
          }
        }
      }
    },
    invalidInput: {
      status: 400,
      description: 'Invalid input',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid input. Please check your data and try again.'
        }
      }
    },
    serverError: {
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error'
        }
      }
    }
  },
  signIn: {
    success: {
      status: 200,
      description: 'Sign in successful',
      schema: {
        example: {
          message: 'Sign in successful',
          data: {
            session: {
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              id: 'a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p',
              email: 'user@example.com',
              phone: '+1234567890',
              full_name: 'John Doe',
              birthday: '1990-01-01'
            },
            csrfToken: '8a90b1c2d3e4f5a6b7c8d9e0f1a2b3c4'
          }
        }
      }
    },
    invalidCredentials: {
      status: 401,
      description: 'Invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials'
        }
      }
    },
    serverError: {
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error'
        }
      }
    }
  },
  refreshToken: {
    success: {
      status: 200,
      description: 'Token refreshed successfully',
      schema: {
        example: {
          message: 'Token refreshed successfully',
          data: {
            session: {
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            csrfToken: '8a90b1c2d3e4f5a6b7c8d9e0f1a2b3c4'
          }
        }
      }
    },
    invalidToken: {
      status: 401,
      description: 'Invalid refresh token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Refresh token missing'
        }
      }
    },
    csrfValidationFailed: {
      status: 403,
      description: 'CSRF token validation failed',
      schema: {
        example: {
          statusCode: 403,
          message: 'CSRF token validation failed'
        }
      }
    }
  },
  signOut: {
    success: {
      status: 200,
      description: 'Sign out successful',
      schema: {
        example: {
          message: 'Sign out successful'
        }
      }
    },
    serverError: {
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error'
        }
      }
    }
  }
};