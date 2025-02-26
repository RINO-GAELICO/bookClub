import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

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
    // If filePath includes protocol and host (e.g. 'http://localhost:5000/uploads/...')
    let localFilePath;
    const protocol = process.env.PROTOCOL; // Default to 'http' if not set
    const host = process.env.HOST;
    const port = process.env.PORT;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
        // Remove the protocol and host part of the URL dynamically
        console.log(`protocol: ${protocol}, host: ${host}, port: ${port}`);
        const cleanedFilePath = filePath.replace(
            `${protocol}://${host}:${port}`,
            ""
        );
        localFilePath = path.join(process.cwd(), cleanedFilePath); // Get the absolute path from the relative URL
    } else {
        localFilePath = path.join(process.cwd(), filePath); // If filePath is already relative, use it as is
    }
    console.log(`localFilePath: ${localFilePath}`);

    const thumbnailPath = path.join(
        process.cwd(),
        "uploads",
        "thumbnails",
        filename
    ); // Path to store the thumbnail

    // Check if the file exists before processing
    if (!fs.existsSync(localFilePath)) {
        console.error(`File not found: ${localFilePath}`);
        throw new Error("Input file is missing");
    }

    try {
        // Generate the thumbnail
        await sharp(localFilePath)
            .resize(100, 100) // Resize the image to 100x100 pixels
            .toFile(thumbnailPath);

        // Return the URL for the thumbnail (accessible by frontend)
        const thumbnailUrl = `${protocol}://${host}:${port}/uploads/thumbnails/${filename}`;

        console.log(`Thumbnail generated at: ${thumbnailPath}`);
        return thumbnailUrl; // Return the URL for the thumbnail
    } catch (error) {
        console.error("Error generating thumbnail:", error);
        throw error; // Re-throw the error for handling elsewhere
    }
};
