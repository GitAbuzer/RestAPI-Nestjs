import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { AddressesController } from './addresses.controller';
import AppUser from 'src/appUsers/entities/app-user.entity';
@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  imports: [TypeOrmModule.forFeature([Address, AppUser])],
})
export class AddressesModule {}
