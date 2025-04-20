import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer token for authentication',
    })
  );
}