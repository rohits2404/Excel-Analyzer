import User from '../models/User.js';
import File from '../models/File.js';
import Analysis from '../models/Analysis.js';

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await File.deleteMany({ uploadedBy: user._id });
        await Analysis.deleteMany({ user: user._id });
        await user.deleteOne();
        res.status(200).json({ message: 'User and related data deleted' });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/files
export const getAllFiles = async (req, res, next) => {
    try {
        const files = await File.find().populate('uploadedBy', 'name email');
        res.status(200).json(files);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/admin/files/:fileId
export const deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) return res.status(404).json({ message: 'File not found' });
        await Analysis.deleteMany({ file: file._id });
        await file.deleteOne();
        res.status(200).json({ message: 'File and related analysis deleted' });
    } catch (err) {
        next(err);
    }
};