import { 
  Controller, 
  Post, 
  Delete,
  UploadedFile, 
  UseInterceptors, 
  Param,
  HttpCode,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { Express } from 'express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.mediaService.uploadImage(file);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to upload image',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  
  @Delete('image/:publicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Image deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid public ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteImage(@Param('publicId') publicId: string) {
    try {
      await this.mediaService.deleteImage(publicId);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to delete image',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  
  @Post('upload/video')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.mediaService.uploadVideo(file);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to upload video',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  
  @Delete('video/:publicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Video deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid public ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteVideo(@Param('publicId') publicId: string) {
    try {
      await this.mediaService.deleteVideo(publicId);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to delete video',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
