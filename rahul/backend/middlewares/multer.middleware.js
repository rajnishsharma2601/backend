import path from "path";
import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Use a local uploads directory for local development or a tmp directory in serverless
    cb(null, "uploads/");  // Change to '/tmp/' in serverless environments like AWS Lambda
  },
  filename: (_req, file, cb) => {
    // Generate a unique filename by appending the timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only certain types of files
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase(); // Ensure extension is in lowercase

  // Check for allowed file extensions
  if (
    ext !== ".jpg" &&
    ext !== ".jpeg" &&
    ext !== ".webp" &&
    ext !== ".png" &&
    ext !== ".mp4"
  ) {
    return cb(new Error(`Unsupported file type! ${ext}`), false); // Reject unsupported files
  }

  cb(null, true); // Accept the file
};

// Multer setup
const upload = multer({
  dest: "uploads/",  // Default location
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size 50 MB
  storage: storage,  // Use custom storage config
  fileFilter: fileFilter,  // Use file filter for validation
});

export default upload;
