import File from '../models/File.js';
import Analysis from '../models/Analysis.js';
import User from "../models/User.js"

export const getUserHistory = async (req, res, next) => {
    try {
        const files = await File.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
        const analyses = await Analysis.find({ user: req.user.id }).populate('file');
        res.status(200).json({ files, analyses });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};