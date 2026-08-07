import express from 'express';
import { 
  uploadNewsImage, 
  createNews, 
  updateNews, 
  getAllNews, 
  getSingleNews, 
  deleteNews,
  getVideoNews, // ✅ NEW
  getWriterStats, // ✅ NEW
} from '../controllers/newsController.js';

import { incrementView } from '../controllers/newsView.controller.js';
import { getTrending } from '../controllers/trending.controller.js';
import { getNewsSectionLayout } from '../controllers/homeLayout.controller.js';

import { protect, authorize } from '../middleware/authMiddleware.js';
import { viewRateLimiter } from '../middleware/rateLimiter.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .png and .webp formats are allowed!'), false);
    }
  },
});

const router = express.Router();

router.post('/image', protect, authorize('writer', 'admin', 'superadmin'), upload.single('image'), uploadNewsImage);

// ===============================
// Special & Analytics Routes (MUST be defined before /:identifier)
// ===============================
router.get('/trending', getTrending);
router.get('/section-layout', getNewsSectionLayout);
router.get('/videos', getVideoNews); // ✅ NEW — homepage Video Gallery
router.get(
  '/writer-stats',
  protect,
  authorize('writer', 'admin', 'superadmin'),
  getWriterStats
); // ✅ NEW — logged-in writer এর নিজের totals (Writer Dashboard stat cards)
router.post('/:id/view', viewRateLimiter, incrementView);

router.route('/')
  .get(getAllNews)
  .post(protect, authorize('writer', 'admin', 'superadmin'), createNews);

router.route('/:identifier')
  .get(getSingleNews);

router.route('/:id')
  .put(protect, authorize('writer', 'admin', 'superadmin'), updateNews)
  .delete(protect, authorize('writer', 'admin', 'superadmin'), deleteNews);

export default router;
