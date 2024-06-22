import path from 'path';
import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed.'));
    }
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error('No image file provided');
    }

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
      Body: Readable.from(file.buffer),
      ContentType: file.mimetype,
    };

    const uploader = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const data = await uploader.done();

    res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

export default router;
