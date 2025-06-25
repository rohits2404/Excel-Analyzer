import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';

// ✅ Dynamic import for CommonJS `streamifier`
const streamifierImport = await import('streamifier');
const streamifier = streamifierImport.default;

const ensureTempDir = () => {
  const tempDir = path.resolve('./temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
};

// 📄 Export as PDF
export const exportChartAsPDF = async (req, res, next) => {
  try {
    const { base64Image, fileName = 'chart' } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: 'Chart image is required' });
    }

    const imageBuffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // ✅ Upload to Cloudinary
    const cloudUploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'charts' },
      (error, result) => {
        if (error) console.error('Cloudinary upload failed:', error);
        else console.log('Cloudinary upload success:', result.secure_url);
      }
    );
    streamifier.createReadStream(imageBuffer).pipe(cloudUploadStream);

    // ✅ Create temp PDF file
    const tempDir = ensureTempDir();
    const filePath = path.join(tempDir, `${fileName}.pdf`);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.image(imageBuffer, {
      fit: [500, 400],
      align: 'center',
      valign: 'center',
    });

    doc.end();

    writeStream.on('finish', () => {
      const pdfBuffer = fs.readFileSync(filePath);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
      res.send(pdfBuffer);

      fs.unlinkSync(filePath); // cleanup
    });
  } catch (error) {
    next(error);
  }
};

// 🖼 Export as PNG
export const exportChartAsPNG = async (req, res, next) => {
  try {
    const { base64Image, fileName = 'chart' } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: 'Chart image is required' });
    }

    const imageBuffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // ✅ Upload to Cloudinary
    const cloudUploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'charts' },
      (error, result) => {
        if (error) console.error('Cloudinary upload failed:', error);
        else console.log('Cloudinary upload success:', result.secure_url);
      }
    );
    streamifier.createReadStream(imageBuffer).pipe(cloudUploadStream);

    // ✅ Create temp PNG file
    const tempDir = ensureTempDir();
    const outputPath = path.join(tempDir, `${fileName}.png`);

    await sharp(imageBuffer).png().toFile(outputPath);

    const pngBuffer = fs.readFileSync(outputPath);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.png"`);
    res.send(pngBuffer);

    fs.unlinkSync(outputPath); // cleanup
  } catch (error) {
    next(error);
  }
};
