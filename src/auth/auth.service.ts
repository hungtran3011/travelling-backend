import { Injectable } from '@nestjs/common';
import { supabaseService, supabase } from 'src/supabase/supabase';

@Injectable()
export class AuthService {
  constructor() {}

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
      refresh_token: refreshToken,});
    
    if (error) throw error;
    return data;
  }

  async createCsrfToken() {
    
  }
}
