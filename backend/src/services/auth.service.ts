import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';
import { generateSocialId } from '../utils/socialId.js';
import { config } from '../config/index.js';
import type { UserCreate } from '../models/User.js';

export async function createUser(userData: UserCreate) {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const socialId = userData.role === 'STUDENT' ? generateSocialId(userData.name) : null;

  db.exec(`
    INSERT INTO users (
      id, email, password, name, role, profileType, socialId
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    crypto.randomUUID(),
    userData.email,
    hashedPassword,
    userData.name,
    userData.role,
    userData.role === 'STUDENT' ? userData.profileType ?? null : null,
    socialId
  ]);

  return getUserByEmail(userData.email);
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!result.length || !result[0].values.length) {
    return null;
  }

  const [id, email_, _, name, role, profileType, socialId] = result[0].values[0];
  return { id, email: email_, name, role, profileType, socialId };
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
}