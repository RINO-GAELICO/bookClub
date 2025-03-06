import multer from "multer";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Configure Google Cloud Storage
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to service account JSON file
});
const bucketName = process.env.GCS_BUCKET_NAME; // Your GCS bucket name
const bucket = storage.bucket(bucketName);

// Multer setup (store files in memory first)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * Uploads an image to Google Cloud Storage
 * @param {Object} file - The uploaded file object from Multer
 * @returns {String} - The public URL of the uploaded image
 */
const uploadToGCS = async (file) => {
    try {
        const filename = `${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(filename);

        // Create a writable stream
        const stream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype },
        });

        // Upload file data
        stream.end(file.buffer);

        // Wait until the file is fully uploaded
        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });

        // Make the file publicly accessible
        await fileUpload.makePublic();

        // Return the public URL
        return `https://storage.googleapis.com/${bucketName}/${filename}`;
    } catch (error) {
        console.error("Error uploading to GCS:", error);
        throw error;
    }
};

/**
 * Generates a thumbnail and uploads it to Google Cloud Storage
 * @param {Buffer} fileBuffer - The uploaded file's buffer
 * @param {String} originalFilename - The original file name
 * @returns {String} - The public URL of the thumbnail
 */
const generateThumbnail = async (fileBuffer, originalFilename) => {
    try {
        const filename = `thumbnails/${uuidv4()}-${originalFilename}`;
        const fileUpload = bucket.file(filename);

        // Generate the thumbnail
        const thumbnailBuffer = await sharp(fileBuffer)
            .resize(100, 100)
            .toBuffer();

        // Create a writable stream
        const stream = fileUpload.createWriteStream({
            metadata: { contentType: "image/png" },
        });

        stream.end(thumbnailBuffer);

        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });

        await fileUpload.makePublic();

        return `https://storage.googleapis.com/${bucketName}/${filename}`;
    } catch (error) {
        console.error("Error generating and uploading thumbnail:", error);
        throw error;
    }
};

export { upload, uploadToGCS, generateThumbnail };
