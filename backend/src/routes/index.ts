import { Express } from 'express';
import authRoutes from './auth.js';
import rulesRoutes from './rules.js';
import sessionsRoutes from './sessions.js';
import achievementsRoutes from './achievements.js';
import instructorRoutes from './instructor.js';

export function setupRoutes(app: Express) {
  app.use('/api/auth', authRoutes);
  app.use('/api/rules', rulesRoutes);
  app.use('/api/sessions', sessionsRoutes);
  app.use('/api/achievements', achievementsRoutes);
  app.use('/api/instructor', instructorRoutes);
}