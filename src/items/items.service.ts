import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import TestItem from './entities/test-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(TestItem)
    private readonly itemsRepository: Repository<TestItem>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const result : TestItem = await this.itemsRepository.save(createItemDto);
    return `${result.id} is created successfully!`;
  }

  async findAll() {
    const items : TestItem[] = await this.itemsRepository.find();
    return (items.length > 0) ? items : `There is no item!`;
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOneBy({ id });
    return (item) ? item : `item not found with ${id}!`;
  }
  
  async update(id: number, updateItemDto: UpdateItemDto) {
    const result = await this.itemsRepository.update(id, updateItemDto);
    return (result.affected > 0) ? 
      `update operation is done successfully with ${id} ` : 
      `something went wrong while update ${id} item!`;
  }

  async remove(id: number) {
    await this.itemsRepository.delete(id);
    return `This action removes a #${id} item`;
  }
}
