import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
@Injectable()
export class ImagesService {
    bucket = 'express-image-upload'
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    s3Region = process.env.AWS_REGION


    async delete(key: string) {
        const params = {
            Bucket: this.bucket,
            Key: key
        };
        try {
            await this.s3.deleteObject(params).promise();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async checked() {
        return { status: 200, message: "Images service is running" }
    }
    async createImage(folder: string, file: Express.Multer.File[]) {
        for (let i = 0; i < file.length; i++) {
            const f = file[i];
            if (!f || !f.buffer) {
                throw new Error('File or file buffer is undefined');
            }
            const fileData = f.buffer;
            const uploadParams = {
                Bucket: this.bucket,
                Key: `${folder}/${f.originalname}`, // Sử dụng originalname thay với name nếu cần
                Body: fileData,
                ContentType: f.mimetype,
                ACL: 'public-read',
                ContentDisposition: 'inline',
                CreateBucketConfiguration: {
                    LocationConstraint: this.s3Region,
                },
            };
            try {
                const data = await this.s3.upload(uploadParams).promise();
                if (!data) {
                    throw new Error('Upload image is failed')
                }
            } catch (err) {
                console.log(err)
                return {
                    status: 400,
                    message: err
                }
            }
        }
        return {
            status: 201,
            message: "Upload image is success"
        }
    }
}
