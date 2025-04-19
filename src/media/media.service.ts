import { Injectable } from '@nestjs/common';
import { UploadApiResponse, DeleteApiResponse } from 'cloudinary';
import cloudinary from 'src/services/cloudinary';

@Injectable()
export class MediaService {
    constructor() { }

    async uploadImage(
        file: Express.Multer.File
    ): Promise<{ url: string; public_id: string }> {
        if (!file || !file?.path) {
            throw new Error('Invalid file. Please provide a valid file to upload.');
        }

        try {
            const result: UploadApiResponse = await cloudinary.uploader.upload(file.path, {
                folder: 'uploads',
                resource_type: 'image',
            });

            if (!result?.secure_url || !result?.public_id) {
                throw new Error('Failed to upload image to Cloudinary.');
            }

            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error uploading image: ${error.message}`);
            }
            throw new Error('Error uploading image: Unknown error');
        }
    }

    async deleteImage(public_id: string): Promise<void> {
        if (!public_id) {
            throw new Error('Invalid public ID. Please provide a valid public ID to delete.');
        }

        try {
            const result = await cloudinary.uploader.destroy(public_id, {
                resource_type: 'image',
            }) as DeleteApiResponse;

            if (result?.http_code !== 200) {
                throw new Error('Failed to delete image from Cloudinary: ' + result?.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error deleting image: ${error.message}`);
            }
            throw new Error('Error deleting image: Unknown error');
        }
    }

    async uploadVideo(
        file: Express.Multer.File
    ): Promise<{ url: string; public_id: string }> {
        if (!file || !file?.path) {
            throw new Error('Invalid file. Please provide a valid file to upload.');
        }

        try {
            const result: UploadApiResponse = await cloudinary.uploader.upload(file.path, {
                folder: 'uploads',
                resource_type: 'video',
            });

            if (!result?.secure_url || !result?.public_id) {
                throw new Error('Failed to upload video to Cloudinary.');
            }

            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error uploading video: ${error.message}`);
            }
            throw new Error('Error uploading video: Unknown error');
        }
    }
    async deleteVideo(public_id: string): Promise<void> {
        if (!public_id) {
            throw new Error('Invalid public ID. Please provide a valid public ID to delete.');
        }

        try {
            const result = await cloudinary.uploader.destroy(public_id, {
                resource_type: 'video',
            }) as DeleteApiResponse;

            if (result?.http_code !== 200) {
                throw new Error('Failed to delete video from Cloudinary: ' + result?.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error deleting video: ${error.message}`);
            }
            throw new Error('Error deleting video: Unknown error');
        }
    }
}
