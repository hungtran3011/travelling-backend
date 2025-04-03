import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({ email, password });
    
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService
      .getClient()
      .auth.signOut();
    
    if (error) throw error;
    return { success: true };
  }
}
