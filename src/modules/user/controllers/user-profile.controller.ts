import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserProfileService } from '../services/user-profile.service';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserProfileResponse } from '../dtos/user-profile-response.dto';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompleteProfile(
    @Body() createCompleteUserProfileDto: CreateCompleteUserProfileDto,
  ): Promise<UserProfileResponse> {
    return this.userProfileService.createCompleteProfile(createCompleteUserProfileDto);
  }

  @Get(':id')
  async findCompleteProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfileResponse> {
    return this.userProfileService.findCompleteProfile(id);
  }

  @Get('user/:userId')
  async findProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserProfileResponse> {
    return this.userProfileService.findProfileByUserId(userId);
  }

  @Put(':id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponse> {
    return this.userProfileService.updateProfile(id, updateUserProfileDto);
  }

  @Put('user/:userId')
  async updateProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponse> {
    return this.userProfileService.updateProfileByUserId(userId, updateUserProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userProfileService.deleteProfile(id);
  }
}