import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import TestItem from './entities/test-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [TypeOrmModule.forFeature([TestItem])],
})
export class ItemsModule {}
