import { SetMetadata } from '@nestjs/common';
import { Role } from './auth.types';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
