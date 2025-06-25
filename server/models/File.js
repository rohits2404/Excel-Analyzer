import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        originalname: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        size: Number,
        mimetype: String,
    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

export default File;