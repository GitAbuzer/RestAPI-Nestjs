import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateAddressDto } from './addresses/dto/requests/create-address.dto';
import CreateAppUserDto from './appUsers/dto/requests/create-app-user.dto';
import { CreateContactInfoDto } from './appUsers/dto/requests/create-contact-info.dto';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { UpdateAddressDto } from './addresses/dto/requests/update.address.dto';
import { UpdateAppUserDto } from './appUsers/dto/requests/update-app-user.dto';
import { UpdateProfileDto } from './profiles/dto/update-profile.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Nestjs REST-API example')
    .setDescription('Nestjs REST-API description')
    .setVersion('1.0')
    .addTag('Nestjs REST-API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      CreateAddressDto,
      CreateAppUserDto,
      CreateContactInfoDto,
      CreateProfileDto,
      UpdateAddressDto,
      UpdateAppUserDto,
      UpdateProfileDto,
    ],
  });

  SwaggerModule.setup('swagger', app, document);

  app.enableCors();

  await app.listen(process.env.PORT);
}
bootstrap();
