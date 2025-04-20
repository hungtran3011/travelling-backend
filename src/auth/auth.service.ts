import { Injectable } from '@nestjs/common';
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
    const { data, error } = await supabaseService
      .auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from signIn');
    
    const { data: additionalData, error: additionalError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    
    if (additionalError) throw additionalError;
    
    // Generate CSRF token for this session
    const csrfToken = this.csrfService.generateTokenValue();
    
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
      additionalData,
      csrfToken, // Include CSRF token in response
    };
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
