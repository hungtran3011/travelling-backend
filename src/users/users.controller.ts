import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return [];
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    // Here you would typically fetch the user from a database
    return {};
  }
}
