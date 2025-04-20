import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CsrfService } from 'src/auth/csrf.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CsrfService],
})
export class UsersModule {}
