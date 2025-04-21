import { Injectable } from '@nestjs/common';
import { doubleCsrf, CsrfTokenCreator } from 'csrf-csrf';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  private csrf: {
    generateToken: CsrfTokenCreator;
    doubleCsrfProtection: (req: any, res: any, next: () => void) => void;
  } = {
    generateToken: () => '',
    doubleCsrfProtection: (req, res, next) => next(),
  };
  
  constructor() {
    const { generateToken, doubleCsrfProtection } = doubleCsrf({
      getSecret: () => process.env.CSRF_SECRET || 'iAOqYtaI97Pchb3HZkKVTXfZw25zPjCo7YTJjgkcmFYeeTHr6Ty3b1uGqaBldpewyVLGzRiVG0QEiWkj4U6JfzQjX55C3ujTZuMdSzhdcO83T15j40zjbE8XqigdFdTYe',
      cookieName: 'x-csrf-token',
      cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    });
    
    this.csrf = {
      generateToken,
      doubleCsrfProtection,
    };
  }
  
  getMiddleware() {
    return this.csrf.doubleCsrfProtection;
  }
  
  // Original method - keep for controller-level usage
  generateToken(req: Request, res: Response, overwrite?: boolean, validateOnReuse?: boolean) {
    return this.csrf.generateToken(req, res, overwrite, validateOnReuse);
  }
  
  // New method - for service-level usage without request/response
  generateTokenValue(): string {
    // Generate a token value only, without setting cookies
    // This is for cases where you need the token value but don't have req/res
    return crypto.randomBytes(64).toString('hex');
  }
  
}