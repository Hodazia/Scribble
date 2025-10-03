

import express, { Router } from "express";
import { Request, Response } from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer"
// import cloudinary from "cloudinary";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const router: Router = express.Router();

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "canvas_uploads",
        format: "png", // or derive from file.mimetype
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: file.originalname.split(".")[0],
      }),
  });
  
const upload = multer({ storage });
  

router.post("/images", protectedRoute, upload.single("file"), async (req:Request,res:Response) => {
    try {
        const file = req.file as any;
        if (!file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        // Support different fields from multer-storage-cloudinary
        const fileUrl: string | undefined = file.path || file.secure_url || file.url;
        if (!fileUrl) {
          return res.status(500).json({ error: "Upload succeeded but no URL returned" });
        }

        res.status(200).json({ url: fileUrl });
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        res.status(500).json({ error: "Image upload failed" });
      }
});

export default router;