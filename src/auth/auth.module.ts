import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CsrfService } from 'src/auth/csrf.service';
import { AuthGuard } from './auth.guard';

@Module({
  // imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, CsrfService, AuthGuard],
  exports: [AuthService, CsrfService, AuthGuard],
})
export class AuthModule {}
