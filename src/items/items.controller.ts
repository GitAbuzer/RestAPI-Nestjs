import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import TestItem from './entities/test-item.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll() {
    return await this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result : TestItem | string = await this.itemsService.findOne(+id);
    const status : HttpStatus = (typeof(result) == 'string') ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    return {
      status: status,
      response: result
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    const result : string = await this.itemsService.update(+id, updateItemDto);
    const status : HttpStatus = ((result).includes('wrong')) ? HttpStatus.BAD_REQUEST : HttpStatus.OK; 
    return `${status} ${result}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.itemsService.remove(+id);
  }
}
