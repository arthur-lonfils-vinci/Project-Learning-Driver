import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Ensure the JWT secret is defined
    if (!config.jwtSecret) {
      throw new Error('JWT secret is not defined');
    }

    // Verify the token and cast to unknown first
    const decoded = jwt.verify(token, config.jwtSecret) as unknown;

    // Assert the decoded token structure
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'role' in decoded) {
      req.user = { id: (decoded as any).userId, role: (decoded as any).role };
      next();
    } else {
      throw new Error('Invalid token structure');
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
}