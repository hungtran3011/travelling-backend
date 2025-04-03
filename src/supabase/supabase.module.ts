import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { SupabaseStrategy } from './supabase.strategy';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [SupabaseService, SupabaseStrategy],
  exports: [SupabaseService],
})
export class SupabaseModule {}