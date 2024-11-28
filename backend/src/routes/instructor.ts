import { Router, Response, NextFunction, Request } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Middleware to ensure user is an instructor
interface User {
  id: string;
  role: string;
}

interface RequestWithUser extends Request {
  user?: User;
}

const ensureInstructor = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.user?.role !== 'INSTRUCTOR') {
    return res.status(403).json({ error: 'Access denied. Instructor role required.' });
  }
  next();
};

// Add student by social ID
router.post('/students', authenticateToken, ensureInstructor, async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { socialId } = req.body;
    const db = await getDb();

    // Find student by social ID
    const studentResult = db.exec(`
      SELECT id, name, email, socialId 
      FROM users 
      WHERE socialId = ? AND role = 'STUDENT'
    `, [socialId]);

    if (!studentResult.length || !studentResult[0].values.length) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = {
      id: studentResult[0].values[0][0],
      name: studentResult[0].values[0][1],
      email: studentResult[0].values[0][2],
      socialId: studentResult[0].values[0][3]
    };

    // Check if relationship already exists
    const relationshipResult = db.exec(`
      SELECT id FROM instructor_students 
      WHERE instructorId = ? AND studentId = ?
    `, [req.user?.id, student.id]);

    if (relationshipResult.length && relationshipResult[0].values.length) {
      return res.status(400).json({ error: 'Student already added' });
    }

    // Create relationship
    const relationshipId = randomUUID();
    db.exec(`
      INSERT INTO instructor_students (
        id, instructorId, studentId, status
      ) VALUES (?, ?, ?, 'ACTIVE')
    `, [relationshipId, req.user.id, student.id]);

    res.json({
      ...student,
      startDate: new Date().toISOString(),
      status: 'ACTIVE',
      progress: {
        practiceHours: 0,
        completedSessions: 0,
        averageRating: 0,
        quizzesPassed: 0
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Get instructor's students with their progress
router.get('/students', authenticateToken, ensureInstructor, async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const db = await getDb();
    
    // Get the basic student info including name and socialId
    const studentsResult = db.exec(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.socialId,
        s.startDate, 
        s.status
      FROM users u
      INNER JOIN instructor_students s ON u.id = s.studentId
      WHERE s.instructorId = ?
      AND u.role = 'STUDENT'
    `, [req.user.id]);

    if (!studentsResult.length) {
      return res.json([]);
    }

    const students = studentsResult[0].values.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      socialId: row[3],
      startDate: row[4],
      status: row[5],
      progress: {
        practiceHours: 0,
        completedSessions: 0,
        averageRating: 0,
        quizzesPassed: 0
      }
    }));

    // Get additional progress info for each student
    for (const student of students) {
      // Get practice hours and sessions
      const sessionsResult = db.exec(`
        SELECT 
          COUNT(*) as completedSessions,
          AVG(CASE WHEN rating IS NOT NULL THEN rating ELSE NULL END) as averageRating,
          SUM(CASE 
            WHEN endTime IS NOT NULL 
            THEN (julianday(endTime) - julianday(startTime)) * 24.0
            ELSE 0 
          END) as practiceHours
        FROM driving_sessions
        WHERE studentId = ?
        AND instructorId = ?
      `, [student.id, req.user.id]);

      if (sessionsResult.length && sessionsResult[0].values.length) {
        const [completedSessions, averageRating, practiceHours] = sessionsResult[0].values[0];
        student.progress.completedSessions = Number(completedSessions) || 0;
        student.progress.averageRating = Number(averageRating) || 0;
        student.progress.practiceHours = Math.round((Number(practiceHours) || 0) * 10) / 10;
      }

      // Get quiz progress
      const quizResult = db.exec(`
        SELECT COUNT(DISTINCT questionId) as passed
        FROM quiz_results
        WHERE userId = ? AND isCorrect = 1
      `, [student.id]);

      if (quizResult.length && quizResult[0].values.length) {
        student.progress.quizzesPassed = Number(quizResult[0].values[0][0]) || 0;
      }
    }

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router;