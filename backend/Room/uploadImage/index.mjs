// uploadHotelPhotos.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
//const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const BUCKET_NAME = 'roomimage';
const REGION = 'us-east-1'; // US East (N. Virginia)
const s3Client = new S3Client({ region: REGION });

exports.handler = async (event) => {
    try {
        const { base64Image, hotelId } = JSON.parse(event.body);
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const imageKey = `hotels/${hotelId}-${Date.now()}.jpg`; // Example key structure

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: imageKey,
            Body: imageBuffer,
            ContentType: 'image/jpeg' // Adjust as per your image type
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading hotel photo', error: error.message })
        };
    }
};
