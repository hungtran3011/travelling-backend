import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseGuard } from '../supabase/supabase.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(SupabaseGuard)
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(SupabaseGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
