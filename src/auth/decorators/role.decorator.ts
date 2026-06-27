import { Reflector } from '@nestjs/core';

export const rolesAll = Reflector.createDecorator<string[]>();
