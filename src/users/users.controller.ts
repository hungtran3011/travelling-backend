import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CsrfGuard } from 'src/auth/csrf.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieved all users successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved user successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiResponse({ status: 200, description: 'Updated user successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  editUser(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.editUser(id, userData);
  }
}
