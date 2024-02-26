import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/requests/create-address.dto';
import { UpdateAddressDto } from './dto/requests/update.address.dto';
import AppUser from 'src/appUsers/entities/app-user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    const address: Address = new Address();
    const appUserId: number = createAddressDto.appUserId;
    const appUser: AppUser = await this.appUserRepository.findOneBy({
      id: appUserId,
    });
    address.appUser = appUser;
    Object.assign(address, createAddressDto);
    const result: Address = await this.addressesRepository.save(address);
    return `${result.id} is created successfully!`;
  }

  async findAll() {
    const addresses: Address[] = await this.addressesRepository.find();
    return addresses.length > 0 ? addresses : `There is no Address!`;
  }

  async findOne(id: number) {
    const Address = await this.addressesRepository.findOneBy({ id });
    return Address ? Address : `Address not found with ${id}!`;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const result = await this.addressesRepository.update(id, updateAddressDto);
    return result.affected > 0
      ? `update operation is done successfully with ${id} `
      : `something went wrong while update ${id} Address!`;
  }

  async remove(id: number) {
    await this.addressesRepository.delete(id);
    return `This action removes a #${id} Address`;
  }
}
