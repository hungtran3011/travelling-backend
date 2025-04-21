import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, description: 'Retrieved all users successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved user successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string', example: 'John Doe' },
        birthday: { type: 'string', format: 'date', example: '1990-01-01' },
        phone: { type: 'string', example: '+1234567890' },
        profile_image: { type: 'string', example: 'https://example.com/image.jpg' },
        role: { type: 'string', example: 'user', description: 'Role must be admin, manager, or user' }
      }
    },
    examples: {
      user: {
        value: {
          full_name: 'John Doe',
          birthday: '1990-01-01', 
          phone: '+1234567890'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Updated user successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  editUser(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.editUser(id, userData);
  }
}
