import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/auth.guard';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure cookie parser
  app.use(cookieParser());
  
  // Apply AuthGuard globally
  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(authGuard);
  
  // Enable CORS with credentials
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Accommodations API')
    .setDescription('The accommodations API description')
    .setVersion('1.0')
    .addTag('accommodations')
    // Add bearer auth to Swagger
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
