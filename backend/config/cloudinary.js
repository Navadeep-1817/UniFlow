const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for different file types
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'ceps/general';
    let resource_type = 'auto';

    // Determine folder based on file type
    if (file.mimetype.startsWith('image/')) {
      folder = 'ceps/images';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'ceps/documents';
      resource_type = 'raw';
    } else if (
      file.mimetype.includes('presentation') || 
      file.mimetype.includes('powerpoint')
    ) {
      folder = 'ceps/presentations';
      resource_type = 'raw';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'ppt', 'pptx'],
      transformation: file.mimetype.startsWith('image/') 
        ? [{ width: 1000, height: 1000, crop: 'limit' }] 
        : undefined,
    };
  },
});

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ File deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = { cloudinary, storage, deleteFromCloudinary };