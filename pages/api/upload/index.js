// api/upload/index.js
import { IncomingForm } from 'formidable';
import cloudinary from '../../../utils/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const form = new IncomingForm({ keepExtensions: true, multiples: false });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!imageFile || !imageFile.filepath) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await cloudinary.uploader.upload(imageFile.filepath, {
      folder: 'jmn',
    });

    // 🔴 CHANGED: return image + imgid matching your DB columns
    return res.status(200).json({
      message: 'Upload successful',
      image: result.secure_url,  
      imgid: result.public_id,   
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
