import {
    Controller,
    Post,
    Delete,
    UploadedFile,
    UseInterceptors,
    Param,
    HttpCode,
    HttpStatus,
    HttpException,
    Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { Express } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Media')
@Controller('media')
export class MediaController {
    private readonly logger = new Logger(MediaController.name);

    constructor(private readonly mediaService: MediaService) { }

    @Post('upload/image')
    @Auth()
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}${ext}`;
                    callback(null, filename);
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            }
        })
    )
    @ApiBearerAuth()
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
        this.logger.debug(`Received file for upload: ${file?.originalname || 'undefined'}`);
        
        if (!file) {
            this.logger.error('No file was received in the request');
            throw new HttpException('No file was uploaded', HttpStatus.BAD_REQUEST);
        }
        
        this.logger.debug(`File details: name=${file.originalname}, size=${file.size}, mimetype=${file.mimetype}, path=${file.path}`);
        
        try {
            const result = await this.mediaService.uploadImage(file);
            this.logger.debug(`Image uploaded successfully. URL: ${result.url.substring(0, 50)}...`);
            return result;
        } catch (error) {
            this.logger.error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : '');
            throw new HttpException(
                error instanceof Error ? error.message : 'Failed to upload image',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('image/:publicId')
    @Auth()
    @Roles(Role.ADMIN, Role.MANAGER)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Image deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid public ID.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async deleteImage(@Param('publicId') publicId: string) {
        this.logger.debug(`Attempting to delete image with public ID: ${publicId}`);
        
        try {
            await this.mediaService.deleteImage(publicId);
            this.logger.debug(`Image deleted successfully. Public ID: ${publicId}`);
        } catch (error) {
            this.logger.error(`Image deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : '');
            throw new HttpException(
                error instanceof Error ? error.message : 'Failed to delete image',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('upload/video')
    @Auth()
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}${ext}`;
                    callback(null, filename);
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i)) {
                    return callback(new Error('Only video files are allowed!'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 100 * 1024 * 1024, // 100MB limit
            }
        })
    )
    @ApiBearerAuth()
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
        this.logger.debug(`Attempting to upload video. File size: ${file?.size || 'unknown'} bytes`);
        
        try {
            const result = await this.mediaService.uploadVideo(file);
            this.logger.debug(`Video uploaded successfully. URL: ${result.url.substring(0, 50)}...`);
            return result;
        } catch (error) {
            this.logger.error(`Video upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : '');
            throw new HttpException(
                error instanceof Error ? error.message : 'Failed to upload video',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('video/:publicId')
    @Auth()
    @Roles(Role.ADMIN, Role.MANAGER)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Video deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid public ID.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async deleteVideo(@Param('publicId') publicId: string) {
        this.logger.debug(`Attempting to delete video with public ID: ${publicId}`);
        
        try {
            await this.mediaService.deleteVideo(publicId);
            this.logger.debug(`Video deleted successfully. Public ID: ${publicId}`);
        } catch (error) {
            this.logger.error(`Video deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : '');
            throw new HttpException(
                error instanceof Error ? error.message : 'Failed to delete video',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
