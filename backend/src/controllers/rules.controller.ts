import { Request, Response } from 'express';
import { getDb } from '../db/index';
import { string } from 'zod';

export async function getCategories(req: Request, res: Response) {
  try {
    console.log('Fetching categories');
    const db = await getDb();
    const categories = db.exec(`
      SELECT 
        c.id, c.icon, c.orderIndex,
        ct.language, ct.name, ct.description
      FROM rule_categories c
      JOIN category_translations ct ON c.id = ct.categoryId
      ORDER BY c.orderIndex ASC
    `);

    if (!categories.length || !categories) {
      console.log('No categories found');
      return res.json([]);
    }

    // Transform the flat results into nested objects
    const categoriesMap = new Map();

    for (const row of categories[0].values) {
      const [id, icon, orderIndex, language, name, description] = row;

      if (!categoriesMap.has(id)) {
        categoriesMap.set(id, {
          id,
          icon,
          orderIndex,
          translations: {},
        });
      }

      const category = categoriesMap.get(id);
      if (typeof language === 'string') {
        category.translations[language] = { name, description };
      }
    }

    res.json(Array.from(categoriesMap.values()));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

export async function getRulesByCategory(req: Request, res: Response) {
  try {
    const db = await getDb();
    const rules = db.exec(
      `
      SELECT 
        r.id, r.categoryId, r.orderIndex, r.mediaUrl, 
        r.validFrom, r.validUntil,
        rt.language, rt.title, rt.content
      FROM road_rules r
      JOIN rule_translations rt ON r.id = rt.ruleId
      WHERE r.categoryId = ?
      ORDER BY r.orderIndex ASC
    `,
      [req.params.categoryId]
    );

    if (!rules.length) {
      return res.json([]);
    }

    // Transform the flat results into nested objects
    const rulesMap = new Map();

    for (const row of rules[0].values) {
      const [
        id,
        categoryId,
        orderIndex,
        mediaUrl,
        validFrom,
        validUntil,
        language,
        title,
        content,
      ] = row;

      if (!rulesMap.has(id)) {
        rulesMap.set(id, {
          id,
          categoryId,
          orderIndex,
          mediaUrl,
          validFrom,
          validUntil,
          translations: {},
        });
      }

      const rule = rulesMap.get(id);
      if (typeof language === 'string') {
        rule.translations[language] = { title, content };
      }
    }

    res.json(Array.from(rulesMap.values()));
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
}

export async function getQuizQuestions(req: Request, res: Response) {
  try {
    const db = await getDb();
    const questions = db.exec(
      `
      SELECT 
        q.id, q.ruleId, q.correctOption,
        qt.language, qt.question, qt.options, qt.explanation
      FROM quiz_questions q
      JOIN quiz_translations qt ON q.id = qt.questionId
      WHERE q.ruleId = ?
      ORDER BY RANDOM()
    `,
      [req.params.ruleId]
    );

    if (!questions.length) {
      return res.json([]);
    }

    // Transform the flat results into nested objects
    const questionsMap = new Map();

    for (const row of questions[0].values) {
      const [
        id,
        ruleId,
        correctOption,
        language,
        question,
        options,
        explanation,
      ] = row;

      if (!questionsMap.has(id)) {
        questionsMap.set(id, {
          id,
          ruleId,
          correctOption,
          translations: {},
        });
      }

      const questionObj = questionsMap.get(id);
      if (typeof language === 'string') {
        questionObj.translations[language] = {
          question,
          options: options,
          explanation,
        };
      }
    }

    res.json(Array.from(questionsMap.values()));
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
}
