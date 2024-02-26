import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { AppUsersModule } from './appUsers/app-users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { ProfilesModule } from './profiles/profile.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AppUsersModule,
    ItemsModule,
    TeamsModule,
    TasksModule,
    AddressesModule,
    ProfilesModule,
    AuthModule,
    TypeOrmModule.forRoot( {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'B@yram&',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true
    } )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}