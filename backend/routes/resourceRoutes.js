const express = require('express');
const {
  uploadResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
  rateResource,
  commentOnResource,
  deleteComment
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// General routes (protected)
router.get('/', protect, getAllResources);
router.get('/:id', protect, getResourceById);

// Download route
router.get('/:id/download', protect, downloadResource);

// Rating & Comment routes (all authenticated users)
router.post('/:id/rate', protect, rateResource);
router.post('/:id/comment', protect, commentOnResource);
router.delete('/:id/comment/:commentId', protect, deleteComment);

// Upload/Create route (Admin, Faculty, Trainer)
router.post('/', protect, authorize('Super Admin', 'Academic Admin', 'Faculty', 'Trainer'), uploadResource);

// Update/Delete routes (Owner or Admin)
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
