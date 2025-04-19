import { Injectable } from '@nestjs/common';
// import { SupabaseService } from '../supabase/supabase.service';
import { supabaseService } from 'src/supabase/supabase';

@Injectable()
export class UsersService {
  constructor() {}

  async findAll() {
    const { data, error } = await supabaseService
      .from('users')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabaseService
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async editUser(id: string, userData: any) {
    const { data, error } = await supabaseService
      .from('users')
      .update(userData)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
  
  async deleteUser(id: string) {
    const { data, error } = await supabaseService
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
  

}
