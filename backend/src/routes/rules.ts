import { Router } from 'express';
import { getCategories, getRulesByCategory, getQuizQuestions } from '../controllers/rules.controller.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/category/:categoryId', getRulesByCategory);
router.get('/rule/:ruleId/quiz', getQuizQuestions);

export default router;