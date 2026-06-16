const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer, folder, publicId = null) => {
  const options = {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto' }],
  };
  if (publicId) options.public_id = publicId;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  const publicId = url.split('/').pop().split('.')[0];
  const folder = url.includes('profiles') ? 'fittrack-pro/profiles' : 'fittrack-pro/progress';
  await cloudinary.uploader.destroy(`${folder}/${publicId}`);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
