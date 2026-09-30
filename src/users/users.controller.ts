import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User as UserModel } from '../generated/prisma/client.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<UserModel[]> {
    return this.usersService.users({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { id: 'asc' },
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModel | null> {
    return this.usersService.user({ id });
  }

  @Post()
  async create(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.usersService.deleteUser({ id });
  }
}
