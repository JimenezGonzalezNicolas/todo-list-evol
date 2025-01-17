import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Remueve propiedades no esperadas
      forbidNonWhitelisted: false, // Permite datos adicionales no definidos en DTOs
    }),
  );

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('EVOL TODO List')
    .setDescription('API de gestión de tareas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
