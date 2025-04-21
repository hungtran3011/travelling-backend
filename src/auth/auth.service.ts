import { Injectable, Logger } from '@nestjs/common';
import { supabaseService, supabase } from 'src/supabase/supabase';
import { CsrfService } from './csrf.service';

@Injectable()
export class AuthService {
  constructor(private readonly csrfService: CsrfService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await supabaseService
      .auth.signUp({ email, password });
    
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    try {
      Logger.log(`Attempting sign in for user: ${email}`);
      
      Logger.log('Step 1: Calling Supabase auth.signInWithPassword');
      const { data, error } = await supabaseService
        .auth.signInWithPassword({ email, password });
      
      if (error) {
        Logger.error('Supabase auth error:', error);
        throw error;
      }
      
      Logger.log('Step 2: Authenticated successfully, user data:', data.user?.id);
      
      if (!data) throw new Error('No data returned from signIn');
      
      Logger.log('Step 3: Querying additional user data from users table');
      const { data: additionalData, error: additionalError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      
      if (additionalError) {
        Logger.error('Error fetching user data:', additionalError);
        // Instead of throwing, consider creating a user record or continuing without additional data
        // throw additionalError;
        Logger.log('Creating default user record');
        // Add code to create a user record
      }
      
      Logger.log('Step 4: Generating CSRF token');
      // Generate CSRF token for this session
      const csrfToken = this.csrfService.generateTokenValue();
      
      Logger.log('Step 5: Returning response data');
      return {
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        },
        user: {
          id: data.user?.id,
          email: data.user?.email,
          phone: data.user?.phone,
          
        },
        additionalData: additionalData || {}, // Provide default if missing
        csrfToken,
      };
    } catch (error) {
      Logger.error('Exception in authService.signIn:', error);
      throw error; // Re-throw to propagate to controller
    }
  }

  async signOut() {
    const { error } = await supabaseService
      .auth.signOut();
    
    if (error) throw error;
    return { success: true };
  }

  async changePassword(email: string, newPassword: string) {
    const { data, error } = await supabaseService
      .auth.updateUser({ password: newPassword });
    
    if (error) throw error;
    return data;
  }

  async handleRefreshToken(refreshToken: string) {
    const { data, error } = await supabaseService.auth.refreshSession({
      refresh_token: refreshToken,
    });
    
    if (error) throw error;
    
    // Generate a new CSRF token when refreshing the session
    const csrfToken = this.csrfService.generateTokenValue();
    
    return {
      ...data,
      csrfToken,
    };
  }
}
