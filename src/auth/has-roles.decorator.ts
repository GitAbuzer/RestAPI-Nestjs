import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/appUsers/entities/role.entity';

export const HasRoles = (...roles: RoleType[]) => SetMetadata('roles', roles);
