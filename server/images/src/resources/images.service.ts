import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ImagesService {
  private readonly bucket = 'express-image-upload';
  private readonly s3Client: S3Client;

  constructor() {
    // Khởi tạo S3Client với cấu hình từ environment variables
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

  }

  async checked() {
    return { status: 200, message: 'Images service is running' };
  }

  async createImage(folder: string, files: Express.Multer.File[]) {
    for (const file of files) {
      if (!file || !file.buffer) {
        throw new Error('File or file buffer is undefined');
      }

      const uploadParams = {
        Bucket: this.bucket,
        Key: `${folder}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Sử dụng 'as const' để chỉ định giá trị là một ObjectCannedACL
        ACL: 'public-read' as const, // Chỉnh sửa ở đây
        ContentDisposition: 'inline',
      };

      try {
        // Sử dụng lệnh PutObjectCommand để upload file lên S3
        const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
        if (!data) {
          throw new Error('Upload image failed');
        }
      } catch (err) {
        console.log(err);
        return {
          status: 400,
          message: err.message,
        };
      }
    }

    return {
      status: 201,
      message: 'Upload image is successful',
    };
  }
}
