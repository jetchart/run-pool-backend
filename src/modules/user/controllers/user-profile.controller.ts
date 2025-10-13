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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileService } from '../services/user-profile.service';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserProfileResponse } from '../dtos/user-profile-response.dto';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imageFile'))
  async createCompleteProfile(
    @Body() createCompleteUserProfileDto: CreateCompleteUserProfileDto,
    @UploadedFile() imageFile?: any,
  ): Promise<UserProfileResponse> {
    if (imageFile) {
      createCompleteUserProfileDto.imageFile = imageFile.buffer;
      if (!createCompleteUserProfileDto.imageName) {
        createCompleteUserProfileDto.imageName = imageFile.originalname;
      }
    }
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
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() imageFile?: any,
  ): Promise<UserProfileResponse> {
    if (imageFile) {
      updateUserProfileDto.imageFile = imageFile.buffer;
      if (!updateUserProfileDto.imageName) {
        updateUserProfileDto.imageName = imageFile.originalname;
      }
    }
    return this.userProfileService.updateProfile(id, updateUserProfileDto);
  }

  @Put('user/:userId')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() imageFile?: any,
  ): Promise<UserProfileResponse> {
    if (imageFile) {
      updateUserProfileDto.imageFile = imageFile.buffer;
      if (!updateUserProfileDto.imageName) {
        updateUserProfileDto.imageName = imageFile.originalname;
      }
    }
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