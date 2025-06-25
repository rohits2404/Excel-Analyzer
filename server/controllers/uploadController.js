import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import File from '../models/File.js';
import Analysis from '../models/Analysis.js';
import { parseExcelFile } from '../utils/parseExcel.js';

// ✅ Import streamifier using dynamic import (TOP LEVEL)
const streamifierImport = await import('streamifier');
const streamifier = streamifierImport.default;

// ✅ Use Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single('excelFile');

// ✅ Upload + parse Excel file controller
export const handleExcelUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // ✅ Parse Excel file from buffer
        const jsonData = parseExcelFile(req.file.buffer);

        // ✅ Upload file buffer to Cloudinary using stream
        const cloudFile = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'excel-uploads',
                    resource_type: 'raw',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        // ✅ Store file metadata
        const uploadedFile = await File.create({
            filename: cloudFile.public_id,
            originalname: req.file.originalname,
            uploadedBy: req.user.id,
            path: cloudFile.secure_url,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });

        // ✅ Store parsed data as analysis
        const analysis = await Analysis.create({
            user: req.user.id,
            file: uploadedFile._id,
            parsedData: jsonData,
        });

        // ✅ Respond with file + analysis IDs
        res.status(201).json({
            fileId: uploadedFile._id,
            analysisId: analysis._id,
            cloudUrl: cloudFile.secure_url,
            data: jsonData,
            message: 'File parsed and uploaded successfully',
        });
    } catch (error) {
        console.error('UPLOAD ERROR:', error);
        next(error);
    }
};