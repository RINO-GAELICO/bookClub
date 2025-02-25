
import multer from "multer";
import sharp from "sharp";


// Set up storage for original images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save original image in uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer upload middleware
export const upload = multer({ storage });

// Function to generate a thumbnail
export const generateThumbnail = async (filePath, filename) => {
    const thumbnailPath = `uploads/thumbnails/${filename}`;

    await sharp(filePath)
        .resize(200, 200) // Resize to 200x200 pixels
        .toFile(thumbnailPath);

    return thumbnailPath; // Return the thumbnail path
};