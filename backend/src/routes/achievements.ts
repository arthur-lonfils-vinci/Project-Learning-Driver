import { Router } from 'express';
import { randomUUID } from 'crypto';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get user achievements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = db.exec(
      `
      SELECT * FROM achievements
      WHERE userId = ?
      ORDER BY earnedAt DESC
    `,
      [req.user.id]
    );

    const achievements =
      result.length > 0
        ? result[0].values.map((row) => ({
            id: row[0],
            userId: row[1],
            type: row[2],
            title: row[3],
            description: row[4],
            progress: row[5],
            maxProgress: row[6],
            earnedAt: row[7],
          }))
        : [];

    res.json(achievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Check for new achievements
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const { type, value } = req.body;
    const newAchievements = [];
    const db = await getDb();
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (type) {
      case 'practice_hours': {
        const totalHours = value;
        const milestones = [10, 20, 50, 100];

        for (const hours of milestones) {
          if (totalHours >= hours) {
            const existingResult = db.exec(
              `
              SELECT id FROM achievements
              WHERE userId = ? AND type = ? AND progress >= ?
            `,
              [req.user.id, 'practice_hours', hours]
            );

            if (
              existingResult.length === 0 ||
              existingResult[0].values.length === 0
            ) {
              const id = randomUUID();
              const achievement = {
                id,
                userId: req.user.id,
                type: 'practice_hours',
                title: JSON.stringify({
                  en: `${hours} Hours on the Road`,
                  fr: `${hours} Heures sur la Route`,
                  nl: `${hours} Uur op de Weg`,
                  de: `${hours} Stunden auf der Straße`,
                }),
                description: JSON.stringify({
                  en: `Completed ${hours} hours of driving practice`,
                  fr: `Effectué ${hours} heures de pratique de conduite`,
                  nl: `${hours} uur rijervaring opgedaan`,
                  de: `${hours} Stunden Fahrpraxis absolviert`,
                }),
                progress: hours,
                maxProgress: hours,
              };

              db.exec(
                `
                INSERT INTO achievements (
                  id, userId, type, title, description,
                  progress, maxProgress
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
                [
                  achievement.id,
                  achievement.userId,
                  achievement.type,
                  achievement.title,
                  achievement.description,
                  achievement.progress,
                  achievement.maxProgress,
                ]
              );

              newAchievements.push(achievement);
            }
          }
        }
        break;
      }

      case 'perfect_speed': {
        const sessions = value;
        if (sessions >= 5) {
          const existingResult = db.exec(
            `
            SELECT id FROM achievements
            WHERE userId = ? AND type = 'perfect_speed'
          `,
            [req.user.id]
          );

          if (
            existingResult.length === 0 ||
            existingResult[0].values.length === 0
          ) {
            const id = randomUUID();
            const achievement = {
              id,
              userId: req.user.id,
              type: 'perfect_speed',
              title: JSON.stringify({
                en: 'Speed Master',
                fr: 'Maître de la Vitesse',
                nl: 'Snelheidsmeester',
                de: 'Geschwindigkeitsmeister',
              }),
              description: JSON.stringify({
                en: 'Completed 5 sessions without speed violations',
                fr: '5 sessions sans excès de vitesse',
                nl: '5 sessies zonder snelheidsovertredingen',
                de: '5 Sitzungen ohne Geschwindigkeitsübertretungen',
              }),
            };

            db.exec(
              `
              INSERT INTO achievements (
                id, userId, type, title, description
              ) VALUES (?, ?, ?, ?, ?)
            `,
              [
                achievement.id,
                achievement.userId,
                achievement.type,
                achievement.title,
                achievement.description,
              ]
            );

            newAchievements.push(achievement);
          }
        }
        break;
      }
    }

    res.json(newAchievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

export default router;
