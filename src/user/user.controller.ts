import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API lấy danh sách tất cả users (không bảo vệ)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // API lấy thông tin user hiện tại, phải có token (bảo vệ bằng JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    // req.user được set bởi JwtStrategy
    return this.userService.findOne(req.user?.['sub']);
  }
}
