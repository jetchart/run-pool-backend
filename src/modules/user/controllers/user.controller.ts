import { Controller, Get, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { UserCredentialDto } from '../dtos/user-credential.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserWithProfile(@Param('id', ParseIntPipe) userId: number): Promise<UserCredentialDto> {
    return this.userService.findUserWithProfile(userId);
  }
}
