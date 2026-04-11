import express from 'express';
import { getDashboard, getLeaderboard, getUserAchievements, getHeatmapData, syncAchievements } from '../controllers/progressController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/leaderboard', getLeaderboard);
router.get('/achievements', getUserAchievements);
router.post('/achievements/sync', syncAchievements);
router.get('/heatmap', getHeatmapData);

export default router;
