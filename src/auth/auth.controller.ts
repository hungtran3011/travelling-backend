import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CsrfService } from './csrf.service';
import { CsrfGuard } from './csrf.guard';
import { Public } from './decorators/public.decorator';
import { AuthDocsApiResponse } from './docs/auth.docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly csrfService: CsrfService,
  ) {}

  @Post('signup')
  @Public()
  @ApiResponse(AuthDocsApiResponse.signUp.success)
  @ApiResponse(AuthDocsApiResponse.signUp.invalidInput)
  @ApiResponse(AuthDocsApiResponse.signUp.serverError)
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
  @Public()
  @ApiResponse(AuthDocsApiResponse.signIn.success)
  @ApiResponse(AuthDocsApiResponse.signIn.invalidCredentials)
  @ApiResponse(AuthDocsApiResponse.signIn.serverError)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signIn(signInDto.email, signInDto.password);

      if (!data || !data.session || !data.user) {
        throw new Error('Invalid authentication response');
      }

      // Set refresh token in HTTP-only cookie
      res.cookie('refresh_token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      
      // Set CSRF token cookie
      res.cookie('x-csrf-token', data.csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
          csrfToken: data.csrfToken, // Send CSRF token to client
        },
      });
    } catch {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CsrfGuard)
  @ApiResponse(AuthDocsApiResponse.refreshToken.success)
  @ApiResponse(AuthDocsApiResponse.refreshToken.invalidToken)
  @ApiResponse(AuthDocsApiResponse.refreshToken.csrfValidationFailed)
  @ApiHeader({ name: 'X-CSRF-TOKEN', description: 'CSRF Token' })
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies['refresh_token'] as string;
      
      if (!refreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Refresh token missing',
        });
      }
      
      // CSRF validation is handled by the middleware
      const data = await this.authService.handleRefreshToken(refreshToken);
      
      // Update refresh token cookie
      res.cookie('refresh_token', data.session?.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      
      // Update CSRF token cookie
      res.cookie('x-csrf-token', data.csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      
      return res.status(HttpStatus.OK).json({
        message: 'Token refreshed successfully',
        data: {
          session: {
            access_token: data.session?.access_token,
          },
          csrfToken: data.csrfToken, // Send new CSRF token to client
        },
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Failed to refresh token',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CsrfGuard)
  @ApiResponse(AuthDocsApiResponse.signOut.success)
  @ApiResponse(AuthDocsApiResponse.signOut.serverError)
  @ApiHeader({ name: 'X-CSRF-TOKEN', description: 'CSRF Token' })
  async signOut(@Res() res: Response) {
    try {
      await this.authService.signOut();
      
      // Clear cookies
      res.clearCookie('refresh_token');
      res.clearCookie('x-csrf-token');
      
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
