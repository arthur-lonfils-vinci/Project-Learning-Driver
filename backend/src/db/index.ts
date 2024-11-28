import initSqlJs from 'sql.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from '../config/index.js';
import { roadRulesData } from '../data/roadRules.js';
import crypto from 'crypto';

//const __dirname = dirname(fileURLToPath(import.meta.url));
//const DB_PATH = join(__dirname, '..', '..', 'data', 'app.db');

const DB_PATH = './backend/data/app.db';

let db: initSqlJs.Database | null = null;

export async function initializeDatabase() {
  if (db) {
    console.log('Database already initialized');
    return db;
  } else {
    console.log('Initializing database...');
  }

  try {
    const SQL = await initSqlJs();

    // Ensure data directory exists
    const dataDir = dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // If database file exists, load it
    if (fs.existsSync(DB_PATH)) {
      console.log('Loading existing database...');
      const data = fs.readFileSync(DB_PATH);
      db = new SQL.Database(data);
    } else {
      console.log('Creating new database...');
      // Create new database
      db = new SQL.Database();
      await createTables();
      await seedRoadRules();

      // Save the initial database
      const data = Buffer.from(db.export());
      fs.writeFileSync(DB_PATH, data);
    }

    // Save database periodically
    setInterval(() => {
      if (db) {
        const data = Buffer.from(db.export());
        fs.writeFileSync(DB_PATH, data);
      }
    }, config.database.saveInterval);

    console.log(
      'Database initialized successfully in initializeDatabase() from index.ts'
    );
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    await initializeDatabase();
    if (!db) throw new Error('Database not initialized at getDb()');
  }
  return db;
}

async function createTables() {
  if (!db) throw new Error('Database not initialized');

  const statements = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR')),
      profileType TEXT,
      socialId TEXT UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_social_id ON users(socialId)`,

    // Instructor-Student relationships
    `CREATE TABLE IF NOT EXISTS instructor_students (
      id TEXT PRIMARY KEY,
      instructorId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
      startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructorId) REFERENCES users(id),
      FOREIGN KEY (studentId) REFERENCES users(id),
      UNIQUE (instructorId, studentId)
    )`,

    // Driving sessions
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

    // Routes
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

    // Speed events
    `CREATE TABLE IF NOT EXISTS speed_events (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      speed REAL NOT NULL,
      speedLimit REAL NOT NULL,
      location TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES driving_sessions(id)
    )`,

    // Session notes
    `CREATE TABLE IF NOT EXISTS session_notes (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES driving_sessions(id)
    )`,

    // Rule categories
    `CREATE TABLE IF NOT EXISTS rule_categories (
      id TEXT PRIMARY KEY,
      icon TEXT NOT NULL,
      orderIndex INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Category translations
    `CREATE TABLE IF NOT EXISTS category_translations (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL,
      language TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES rule_categories(id),
      UNIQUE (categoryId, language)
    )`,

    // Road rules
    `CREATE TABLE IF NOT EXISTS road_rules (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL,
      orderIndex INTEGER NOT NULL,
      mediaUrl TEXT,
      validFrom DATETIME,
      validUntil DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES rule_categories(id)
    )`,

    // Rule translations
    `CREATE TABLE IF NOT EXISTS rule_translations (
      id TEXT PRIMARY KEY,
      ruleId TEXT NOT NULL,
      language TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ruleId) REFERENCES road_rules(id),
      UNIQUE (ruleId, language)
    )`,

    // Quiz questions
    `CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      ruleId TEXT NOT NULL,
      correctOption INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ruleId) REFERENCES road_rules(id)
    )`,

    // Quiz translations
    `CREATE TABLE IF NOT EXISTS quiz_translations (
      id TEXT PRIMARY KEY,
      questionId TEXT NOT NULL,
      language TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      explanation TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionId) REFERENCES quiz_questions(id),
      UNIQUE (questionId, language)
    )`,

    // Quiz results
    `CREATE TABLE IF NOT EXISTS quiz_results (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      questionId TEXT NOT NULL,
      selectedOption INTEGER NOT NULL,
      isCorrect BOOLEAN NOT NULL,
      completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (questionId) REFERENCES quiz_questions(id)
    )`,

    // Achievements
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

    `CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(userId)`,
  ];

  db.exec('BEGIN TRANSACTION');
  try {
    for (const statement of statements) {
      db.exec(statement);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

async function seedRoadRules() {
  if (!db) throw new Error('Database not initialized');

  db.exec('BEGIN TRANSACTION');
  try {
    // Seed categories and their translations
    for (const category of roadRulesData) {
      // Insert category
      if (category.id && category.icon && category.orderIndex !== undefined) {
        db.exec(
          'INSERT INTO rule_categories (id, icon, orderIndex) VALUES (?, ?, ?)',
          [category.id, category.icon, category.orderIndex]
        );
      }

      // Insert category translations
      for (const [lang, translation] of Object.entries(category.translations)) {
        db.exec(
          `
          INSERT INTO category_translations (
            id, categoryId, language, name, description
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID(),
            category.id,
            lang,
            translation.name,
            translation.description,
          ]
        );
      }

      // Insert rules and their translations
      if (category.rules) {
        for (const rule of category.rules ?? []) {
          // Insert rule
          db.exec(
            `
            INSERT INTO road_rules (
              id, categoryId, orderIndex, mediaUrl, validFrom, validUntil
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              rule.id,
              category.id,
              rule.orderIndex ?? 0,
              rule.mediaUrl ?? null,
              rule.validFrom ?? null,
              rule.validUntil ?? null,
            ]
          );

          // Insert rule translations
          for (const [lang, translation] of Object.entries(rule.translations)) {
            db.exec(
              `
              INSERT INTO rule_translations (
                id, ruleId, language, title, content
              ) VALUES (?, ?, ?, ?, ?)`,
              [
                crypto.randomUUID(),
                rule.id,
                lang,
                translation.title,
                translation.content,
              ]
            );
          }

          // Insert quiz questions and their translations
          if (rule.quiz) {
            for (const question of rule.quiz) {
              // Insert question
              db.exec(
                `
                INSERT INTO quiz_questions (
                  id, ruleId, correctOption
                ) VALUES (?, ?, ?)`,
                [question.id, rule.id, question.correctOption]
              );

              // Insert question translations
              for (const [lang, translation] of Object.entries(
                question.translations
              )) {
                db.exec(
                  `
                  INSERT INTO quiz_translations (
                    id, questionId, language, question, options, explanation
                  ) VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    crypto.randomUUID(),
                    question.id,
                    lang,
                    translation.question,
                    JSON.stringify(translation.options),
                    translation.explanation,
                  ]
                );
              }
            }
          }
        }
      }
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
