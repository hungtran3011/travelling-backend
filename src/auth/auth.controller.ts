import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req, UseGuards, Logger } from '@nestjs/common';
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
      // Use try/catch consistently instead of mixing with .then()
      const data = await this.authService.signIn(signInDto.email, signInDto.password);
      
      // Log for debugging
      Logger.log('Raw auth data received:', data);
      
      // Check data validity
      if (!data) {
        Logger.error('Authentication returned no data');
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }
      
      if (!data.session || !data.user) {
        Logger.error('Invalid authentication response structure:', data);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Invalid authentication response',
        });
      }
      
      // The rest of the function remains the same
      // Set cookies and return response...
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
      
      Logger.log('Sign-in successful for user:', data.user.email);
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
            // full_name: data.additionalData?.full_name || null,
            // birthday: data.additionalData?.birthday || null,
          },
          csrfToken: data.csrfToken,
        },
      });
    } catch (error: unknown) {
      Logger.error('SignIn Error:', error);
      
      // Differentiate between types of errors
      if (error instanceof Error && error.message.includes('Invalid credentials')) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
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
