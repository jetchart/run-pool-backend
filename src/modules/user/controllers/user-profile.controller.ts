import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserProfileService } from '../services/user-profile.service';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { UserProfileEntity } from '../entities/user-profile.entity';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompleteProfile(
    @Body() createCompleteUserProfileDto: CreateCompleteUserProfileDto,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.createCompleteProfile(createCompleteUserProfileDto);
  }

  @Get(':id')
  async findCompleteProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.findCompleteProfile(id);
  }

  @Get('user/:userId')
  async findProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.findProfileByUserId(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userProfileService.deleteProfile(id);
  }
}