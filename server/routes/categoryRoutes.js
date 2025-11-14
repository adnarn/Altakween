const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (Admin only)
router.use(protect);

// Admin routes
router.post('/', createCategory);
router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
