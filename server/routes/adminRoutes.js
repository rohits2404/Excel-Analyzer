import express from 'express';
import { getAllUsers, deleteUser, getAllFiles, deleteFile } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Extra check for admin role
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

router.get('/users', adminOnly, getAllUsers);
router.delete('/users/:userId', adminOnly, deleteUser);
router.get('/files', adminOnly, getAllFiles);
router.delete('/files/:fileId', adminOnly, deleteFile);

export default router;