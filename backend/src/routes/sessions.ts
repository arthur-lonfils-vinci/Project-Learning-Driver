import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const startSessionSchema = z.object({
  startLocation: locationSchema,
  startTime: z.string(),
  weather: z.string(),
});

const speedEventSchema = z.object({
  speed: z.number(),
  speedLimit: z.number(),
  location: locationSchema,
});

// Start a new session
router.post('/', authenticateToken, (req, res) => {
  try {
    const { startLocation, startTime, weather } = startSessionSchema.parse(
      req.body
    );
    const sessionId = randomUUID();
    const db = getDb();
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user_id = req.user.id;

    db.exec(
      `
      INSERT INTO driving_sessions (
        id, studentId, startTime, weather, distance
      ) VALUES (?, ?, ?, ?, ?)
    `,
      [sessionId, user_id, startTime, weather, 0]
    );

    // Initialize route
    const routeId = randomUUID();
    db.exec(
      `
      INSERT INTO routes (
        id, sessionId, startLocation, endLocation, waypoints
      ) VALUES (?, ?, ?, ?, ?)
    `,
      [
        routeId,
        sessionId,
        JSON.stringify(startLocation),
        JSON.stringify(startLocation),
        JSON.stringify([startLocation]),
      ]
    );

    const result = db.exec('SELECT * FROM driving_sessions WHERE id = ?', [
      sessionId,
    ]);
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Session not found after creation');
    }

    const session = {
      id: result[0].values[0][0],
      studentId: result[0].values[0][1],
      startTime: result[0].values[0][3],
      weather: result[0].values[0][6],
      distance: result[0].values[0][5],
    };

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// End a session
router.post('/:id/end', authenticateToken, (req, res) => {
  try {
    const { endLocation } = locationSchema.parse(req.body);
    const { id } = req.params;
    const db = getDb();

    db.exec(
      `
      UPDATE driving_sessions
      SET endTime = CURRENT_TIMESTAMP
      WHERE id = ? AND studentId = ?
    `,
      [id, req.user.id]
    );

    // Update route
    db.exec(
      `
      UPDATE routes
      SET endLocation = ?
      WHERE sessionId = ?
    `,
      [JSON.stringify(endLocation), id]
    );

    const result = db.exec('SELECT * FROM driving_sessions WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Session not found');
    }

    const session = {
      id: result[0].values[0][0],
      studentId: result[0].values[0][1],
      endTime: result[0].values[0][4],
      weather: result[0].values[0][6],
      distance: result[0].values[0][5],
    };

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Record speed event
router.post('/speed-event', authenticateToken, (req, res) => {
  try {
    const { speed, speedLimit, location } = speedEventSchema.parse(req.body);
    const id = randomUUID();
    const db = getDb();

    db.exec(
      `
      INSERT INTO speed_events (
        id, sessionId, speed, speedLimit, location
      ) VALUES (?, ?, ?, ?, ?)
    `,
      [id, req.body.sessionId, speed, speedLimit, JSON.stringify(location)]
    );

    const result = db.exec('SELECT * FROM speed_events WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Speed event not found after creation');
    }

    const event = {
      id: result[0].values[0][0],
      sessionId: result[0].values[0][1],
      speed: result[0].values[0][2],
      speedLimit: result[0].values[0][3],
      location: JSON.parse(result[0].values[0][4]),
    };

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record speed event' });
  }
});

// Add session note
router.post('/:id/notes', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const noteId = randomUUID();
    const db = getDb();

    db.exec(
      `
      INSERT INTO session_notes (
        id, sessionId, content
      ) VALUES (?, ?, ?)
    `,
      [noteId, id, content]
    );

    const result = db.exec('SELECT * FROM session_notes WHERE id = ?', [
      noteId,
    ]);
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Note not found after creation');
    }

    const note = {
      id: result[0].values[0][0],
      sessionId: result[0].values[0][1],
      content: result[0].values[0][2],
      timestamp: result[0].values[0][3],
    };

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

export default router;