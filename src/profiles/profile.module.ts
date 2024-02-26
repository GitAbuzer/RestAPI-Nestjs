import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profile.service';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { ProfilesController } from './profile.controller';
import { Profile } from './entities/profile.entity';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [TypeOrmModule.forFeature([Profile, AppUser])]
})
export class ProfilesModule {}
