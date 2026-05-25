const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloudinary_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_api_key_12345',
  api_secret: process.env.CLOUDINARY_SECRET || 'mock_cloudinary_secret_abcde'
});

// Configure Multer storage (staged locally under uploads/)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Accept only images or PDFs
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Deed upload must be PDF or image format (PNG/JPG).'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Cloudinary Uploader
const uploadToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Fallback Mock if default keys are set
    if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloudinary_cloud') {
      console.warn('Using mock Cloudinary CDN upload.');
      return { secure_url: `https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600` };
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'landchain_deeds'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Failed:', error.message);
    throw error;
  } finally {
    // Delete local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// Pinata IPFS Uploader (POST multipart to Pinata API)
const uploadToIPFS = async (filePath, originalName) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found for IPFS pinning: ${filePath}`);
    }

    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecret = process.env.PINATA_SECRET;

    // Check for mock environment
    if (!pinataApiKey || pinataApiKey === 'mock_pinata_api_key') {
      console.warn('Using mock IPFS Pinata CID hash.');
      const mockCid = `Qm${Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      return { ipfsHash: mockCid };
    }

    // Read file stream
    const FormData = require('form-data');
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    data.append('pinataMetadata', JSON.stringify({
      name: originalName || 'deed_document'
    }));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecret
      }
    });

    return { ipfsHash: response.data.IpfsHash };
  } catch (error) {
    console.error('Pinata IPFS Upload Failed:', error.message);
    throw error;
  } finally {
    // Clean local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadToIPFS
};
