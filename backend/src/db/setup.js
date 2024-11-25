import initSqlJs from 'sql.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'app.db');

async function setup() {
  try {
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR')),
        profileType TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,

      `CREATE TABLE IF NOT EXISTS driving_sessions (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        instructorId TEXT,
        startTime DATETIME NOT NULL,
        endTime DATETIME,
        distance REAL DEFAULT 0,
        weather TEXT NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 0 AND 5),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (instructorId) REFERENCES users(id)
      )`,

      `CREATE INDEX IF NOT EXISTS idx_sessions_student ON driving_sessions(studentId)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_instructor ON driving_sessions(instructorId)`,

      `CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        sessionId TEXT UNIQUE NOT NULL,
        startLocation TEXT NOT NULL,
        endLocation TEXT NOT NULL,
        waypoints TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES driving_sessions(id)
      )`,

      `CREATE TABLE IF NOT EXISTS speed_events (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        speed REAL NOT NULL,
        speedLimit REAL NOT NULL,
        location TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES driving_sessions(id)
      )`,

      `CREATE TABLE IF NOT EXISTS session_notes (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES driving_sessions(id)
      )`,

      `CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        progress INTEGER,
        maxProgress INTEGER,
        earnedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,

      `CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(userId)`
    ];

    db.exec('BEGIN TRANSACTION');
    try {
      for (const statement of statements) {
        db.exec(statement);
      }
      db.exec('COMMIT');

      // Save the database to disk
      const data = Buffer.from(db.export());
      fs.writeFileSync(DB_PATH, data);

      console.log('Database setup completed successfully');
      process.exit(0);
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();