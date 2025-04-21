import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, DeleteApiResponse, UploadApiOptions } from 'cloudinary';
import cloudinary from 'src/services/cloudinary';
import * as fs from 'fs';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor() { }

    async uploadImage(
        file: Express.Multer.File
    ): Promise<{ url: string; public_id: string }> {
        this.logger.debug(`Starting image upload process`);

        if (!file) {
            this.logger.error('File is undefined or null');
            throw new Error('Invalid file. Please provide a valid file to upload.');
        }
        
        if (!file.path) {
            this.logger.error(`File object has no path: ${JSON.stringify({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            })}`);
            throw new Error('Invalid file path. The file was not properly saved.');
        }
        
        // Check if file exists on disk
        // const fs = require('fs');
        if (!fs.existsSync(file.path)) {
            this.logger.error(`File does not exist at path: ${file.path}`);
            throw new Error('File not found on disk. Upload failed.');
        }

        try {
            this.logger.debug(`Uploading image to Cloudinary, file path: ${file.path}`);
            
            // More detailed options to help with upload issues
            const options: UploadApiOptions = {
                folder: 'uploads',
                resource_type: 'image',
                use_filename: true,
                unique_filename: true,
                overwrite: true
            };
            
            this.logger.debug(`Cloudinary upload options: ${JSON.stringify(options)}`);
            
            const result: UploadApiResponse = await cloudinary.uploader.upload(file.path, options);

            // Enhanced result logging
            this.logger.debug(`Cloudinary response received: ${JSON.stringify({
                public_id: result?.public_id,
                url_exists: Boolean(result?.secure_url),
                format: result?.format,
                resource_type: result?.resource_type
            })}`);

            if (!result?.secure_url || !result?.public_id) {
                this.logger.error(`Cloudinary returned invalid result: ${JSON.stringify({
                    secure_url: Boolean(result?.secure_url),
                    public_id: Boolean(result?.public_id)
                })}`);
                throw new Error('Failed to upload image to Cloudinary.');
            }

            // Clean up temp file after successful upload
            try {
                fs.unlinkSync(file.path);
                this.logger.debug(`Temporary file deleted: ${file.path}`);
            } catch (unlinkError) {
                this.logger.warn(`Could not delete temporary file: ${file.path}`, unlinkError);
            }

            this.logger.debug(`Image uploaded successfully. Public ID: ${result.public_id}, URL: ${result.secure_url.substring(0, 30)}...`);
            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            this.logger.error(
                `Error in uploadImage: ${error instanceof Error ? error.message : 'Unknown error'}`, 
                error instanceof Error ? error.stack : 'No stack trace'
            );
            
            if (error instanceof Error) {
                throw new Error(`Error uploading image: ${error.message}`);
            }
            throw new Error('Error uploading image: Unknown error');
        }
    }

    async deleteImage(public_id: string): Promise<void> {
        this.logger.debug(`Starting image deletion process for public ID: ${public_id}`);
        
        if (!public_id) {
            this.logger.warn(`Invalid public ID provided for deletion`);
            throw new Error('Invalid public ID. Please provide a valid public ID to delete.');
        }

        try {
            this.logger.debug(`Sending delete request to Cloudinary for image: ${public_id}`);
            const result = await cloudinary.uploader.destroy(public_id, {
                resource_type: 'image',
            }) as DeleteApiResponse;

            this.logger.debug(`Cloudinary delete response: ${JSON.stringify(result)}`);

            if (result?.http_code !== 200) {
                this.logger.error(`Failed to delete image: ${result?.message || 'Unknown error'}`);
                throw new Error('Failed to delete image from Cloudinary: ' + result?.message);
            }
            
            this.logger.debug(`Image deleted successfully`);
        } catch (error) {
            this.logger.error(
                `Error in deleteImage: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error instanceof Error ? error.stack : 'No stack trace'
            );
            
            if (error instanceof Error) {
                throw new Error(`Error deleting image: ${error.message}`);
            }
            throw new Error('Error deleting image: Unknown error');
        }
    }

    async uploadVideo(
        file: Express.Multer.File
    ): Promise<{ url: string; public_id: string }> {
        this.logger.debug(`Starting video upload process`);

        if (!file || !file?.path) {
            this.logger.warn(`Invalid file provided for upload: ${JSON.stringify(file)}`);
            throw new Error('Invalid file. Please provide a valid file to upload.');
        }

        try {
            this.logger.debug(`Uploading video to Cloudinary, file path: ${file.path}`);
            const result: UploadApiResponse = await cloudinary.uploader.upload(file.path, {
                folder: 'uploads',
                resource_type: 'video',
            });

            if (!result?.secure_url || !result?.public_id) {
                this.logger.error(`Cloudinary returned invalid result: ${JSON.stringify(result)}`);
                throw new Error('Failed to upload video to Cloudinary.');
            }

            this.logger.debug(`Video uploaded successfully. Public ID: ${result.public_id}`);
            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            this.logger.error(
                `Error in uploadVideo: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error instanceof Error ? error.stack : 'No stack trace'
            );
            
            if (error instanceof Error) {
                throw new Error(`Error uploading video: ${error.message}`);
            }
            throw new Error('Error uploading video: Unknown error');
        }
    }
    
    async deleteVideo(public_id: string): Promise<void> {
        this.logger.debug(`Starting video deletion process for public ID: ${public_id}`);
        
        if (!public_id) {
            this.logger.warn(`Invalid public ID provided for deletion`);
            throw new Error('Invalid public ID. Please provide a valid public ID to delete.');
        }

        try {
            this.logger.debug(`Sending delete request to Cloudinary for video: ${public_id}`);
            const result = await cloudinary.uploader.destroy(public_id, {
                resource_type: 'video',
            }) as DeleteApiResponse;

            this.logger.debug(`Cloudinary delete response: ${JSON.stringify(result)}`);

            if (result?.http_code !== 200) {
                this.logger.error(`Failed to delete video: ${result?.message || 'Unknown error'}`);
                throw new Error('Failed to delete video from Cloudinary: ' + result?.message);
            }
            
            this.logger.debug(`Video deleted successfully`);
        } catch (error) {
            this.logger.error(
                `Error in deleteVideo: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error instanceof Error ? error.stack : 'No stack trace'
            );
            
            if (error instanceof Error) {
                throw new Error(`Error deleting video: ${error.message}`);
            }
            throw new Error('Error deleting video: Unknown error');
        }
    }
}
