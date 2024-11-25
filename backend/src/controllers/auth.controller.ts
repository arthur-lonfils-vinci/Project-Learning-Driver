import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDb } from '../db/index';
import { generateSocialId } from '../utils/socialId';
import { config } from '../config';

// Validation schemas
const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['STUDENT', 'INSTRUCTOR']),
    profileType: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.role === 'STUDENT' && !data.profileType) {
        return false;
      }
      if (data.role === 'INSTRUCTOR' && data.profileType) {
        return false;
      }
      return true;
    },
    {
      message:
        'Profile type is required for students and should not be present for instructors',
    }
  );

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, role, profileType } = registerSchema.parse(
      req.body
    );
    const db = await getDb();

    const result = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (result.length > 0 && result[0].values.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomUUID();
    const socialId = role === 'STUDENT' ? generateSocialId(name) : null;

    try {
      db.exec(
        `
        INSERT INTO users (
          id, email, password, name, role, profileType, socialId
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          id,
          email,
          hashedPassword,
          name,
          role,
          role === 'STUDENT' ? profileType ?? null : null,
          socialId,
        ]
      );

      const userResult = db.exec('SELECT * FROM users WHERE id = ?', [id]);
      if (userResult.length === 0 || userResult[0].values.length === 0) {
        throw new Error('User not found after creation');
      }

      const user = {
        id: userResult[0].values[0][0],
        email: userResult[0].values[0][1],
        name: userResult[0].values[0][3],
        role: userResult[0].values[0][4],
        profileType: userResult[0].values[0][5],
        socialId: userResult[0].values[0][6],
      };

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret!,
        { expiresIn: '24h' }
      );

      res.json({ user, token });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function login(req: Request, res: Response) {
  console.log('The request has reached the backend => ', req.body?.email);

  try {
    const { email, password } = loginSchema.parse(req.body);
    const db = await getDb();

    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = {
      id: result[0].values[0][0],
      email: result[0].values[0][1],
      password: result[0].values[0][2],
      name: result[0].values[0][3],
      role: result[0].values[0][4],
      profileType: result[0].values[0][5],
      socialId: result[0].values[0][6],
    };

    if (typeof user.password !== 'string') {
      return res.status(401).json({ error: 'Invalid credentials (wrong type)' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret!,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
