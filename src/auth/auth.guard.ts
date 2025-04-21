import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { supabaseService, supabase } from 'src/supabase/supabase';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from './decorators/roles.decorator';
import { User } from './types/user.types'; // Import your User interface

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');
    
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Authorization type must be Bearer');
    }

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Verify the token with Supabase
      const { data, error } = await supabaseService.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach the user to the request with proper typing
      request.user = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role, // Assuming role is part of the user object
      } as User;
      
      // After user is authenticated, check roles if specified
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      if (!requiredRoles || requiredRoles.length === 0) {
        // No specific roles required for this route
        return true;
      }
      
      // Get the user ID from the authenticated user
      const userId = data.user.id;
      
      // Fetch user role from the users table in the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user role:', userError);
        throw new ForbiddenException('Unable to verify user permissions');
      }
      
      // Get the role from database or default to 'user'
      const userRole = userData?.role || 'anon';
      
      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.includes(userRole);
      
      if (!hasRequiredRole) {
        throw new ForbiddenException(`Insufficient permissions. Required: ${requiredRoles.join(', ')}, Got: ${userRole}`);
      }
      
      // Add the role to the request user object using type assertion
      (request.user).role = userRole;
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
