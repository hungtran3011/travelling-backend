import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Sign up successful' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signUp(signUpDto.email, signUpDto.password);
      return res.status(HttpStatus.CREATED).json({
        message: 'Sign up successful',
        data,
      });
    } catch {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input. Please check your data and try again.',
      });
    }
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Sign in successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signIn(signInDto.email, signInDto.password);

      if (!data || !data.session || !data.user) {
        throw new Error('Invalid authentication response');
      }

      res.cookie('refresh_token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return res.status(HttpStatus.OK).json({
        message: 'Sign in successful',
        data: {
          session: {
            access_token: data.session.access_token,
          },
          user: {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone,
            full_name: data.additionalData?.full_name || null,
            birthday: data.additionalData?.birthday || null,
          },
        },
      });
    } catch {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async changePassword(
    @Body() changePasswordDto: { email: string; newPassword: string },
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.changePassword(changePasswordDto.email, changePasswordDto.newPassword);
      return res.status(HttpStatus.OK).json({
        message: 'Password changed successfully',
        data,
      });
    } catch {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input. Please check your data and try again.',
      });
    }
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Sign out successful' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signOut(@Res() res: Response) {
    try {
      await this.authService.signOut();
      return res.status(HttpStatus.OK).json({
        message: 'Sign out successful',
      });
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}
