const multer = require("multer");
const path = require("path");

// Get the project root directory
const projectRoot = path.resolve(__dirname, '../../');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(projectRoot, 'public/images')); // Save files to public/images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Generate a unique filename
    },
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."));
        }
    },
});

module.exports = upload;