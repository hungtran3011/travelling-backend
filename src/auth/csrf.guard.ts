import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CsrfService } from './csrf.service';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private csrfService: CsrfService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Use the CSRF middleware directly
    try {
      // Pass request through the CSRF protection middleware
      const csrfMiddleware = this.csrfService.getMiddleware();
      await new Promise<void>((resolve, reject) => {
        csrfMiddleware(
          request, 
          {} as Record<string, never>, 
          (err?: Error) => {
            if (err) {
              reject(new UnauthorizedException('CSRF validation failed: ' + (err instanceof Error ? err.message : 'Unknown error')));
            } else {
              resolve();
            }
          }
        );
      });
      return true;
    } catch (error: unknown) {
      throw new UnauthorizedException('CSRF validation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}