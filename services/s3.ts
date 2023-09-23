import aws from 'aws-sdk';
import { UploadedFile } from 'express-fileupload';
import logger from '../utils/logger.js';
import 'dotenv/config';

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET, S3_REGION } = process.env;

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: S3_REGION
});

export const uploadFileToAWS = async (file: UploadedFile, folder: string) => {
  try {
    const data = await s3.upload({
      Bucket: S3_BUCKET + folder,
      Key: file.name,
      Body: file.data
    }).promise();
    return data.Location;
  } catch (error) {
    logger.error(`Ошибка при загрузки файла: ${error}`);
  }
}

export const deleteFileFromAWS = async (fileUrl: string) => {
  try {
    const key = decodeURIComponent(fileUrl.replace(`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/`, ''));
    await s3.deleteObject({ 
      Bucket: S3_BUCKET!, 
      Key: key
    }).promise();
    logger.info(`Файл ${key} удален из бакета.`);
  } catch (error) {
    logger.error(`Ошибка при удалении файла: ${error}`);
  }
};