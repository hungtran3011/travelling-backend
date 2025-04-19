import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/services/cloudinary';

@Injectable()
export class MediaService {
  constructor() {}

  async uploadImage(
    file: Express.Multer.File
  ): Promise<{ url: string; public_id: string }> {
    if (!file || !file?.path) {
      throw new Error('Invalid file. Please provide a valid file to upload.');
    }

    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(file.path, {
        folder: 'images',
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
}
