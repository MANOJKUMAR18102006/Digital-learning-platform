import express from 'express';
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
  generateStudyPlan,
  analyzeQuiz,
  explainSpoken,
  generateNotes,
  generateMindmap,
  analyzePerformance,
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';

console.log("✅ AI Routes Loaded");

const router = express.Router();

router.use(protect);

router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-quiz', generateQuiz);
router.post('/generate-summary', generateSummary);
router.post('/chat', chat);
router.post('/explain-concept', explainConcept);
router.post('/generate-study-plan', generateStudyPlan);
router.post('/analyze-quiz', analyzeQuiz);
router.post('/explain-spoken', explainSpoken);
router.post('/generate-notes', generateNotes);
router.post('/generate-mindmap', generateMindmap);
router.get('/analyze-performance', protect, analyzePerformance);
router.get('/chat-history/:documentId', getChatHistory);

export default router;
