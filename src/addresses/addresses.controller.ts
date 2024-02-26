import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/requests/create-address.dto';
import { UpdateAddressDto } from './dto/requests/update.address.dto';
import { Address } from './entities/address.entity';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressesService.create(createAddressDto);
  }

  @Get()
  async findAll() {
    return await this.addressesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result : Address | string = await this.addressesService.findOne(+id);
    const status : HttpStatus = (typeof(result) == 'string') ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    return {
      status: status,
      response: result
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const result : string = await this.addressesService.update(+id, updateAddressDto);
    const status : HttpStatus = ((result).includes('wrong')) ? HttpStatus.BAD_REQUEST : HttpStatus.OK; 
    return `${status} ${result}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.addressesService.remove(+id);
  }
}
