import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtSecretKey } from './constants/jwt.constants';

@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AppUser]),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_KEY || jwtSecretKey,
      signOptions: { expiresIn: '8h' },
    }),
  ],
})
export class AuthModule {}
