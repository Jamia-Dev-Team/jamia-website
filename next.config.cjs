
// next.config.js

const nextConfig = {
  // reactStrictMode: true,
  env: {
    MONGO_URI:
      "postgresql://neondb_owner:npg_cqu89PonCkRf@ep-orange-water-a159nvne-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  
  images: {
    domains: ['res.cloudinary.com','drive.google.com'],
  },
};

module.exports = nextConfig;


 