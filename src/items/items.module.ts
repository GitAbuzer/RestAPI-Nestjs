import { Module, forwardRef } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Repository } from 'typeorm';
import TestItem from './entities/test-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [TypeOrmModule.forFeature([TestItem])]
})
export class ItemsModule {}
