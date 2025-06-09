import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    return this.usersService.updateRole(+id, role, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.usersService.delete(+id, req.user);
  }
}
