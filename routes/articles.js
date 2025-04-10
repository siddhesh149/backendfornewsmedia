const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const moment = require('moment');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get all articles with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured === 'true';

    let query = `
      SELECT a.*, c.name as category_name 
      FROM articles a 
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (featured) {
      query += ` AND a.featured = true`;
    }

    query += ` ORDER BY a.published_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT a.*, c.name as category_name 
       FROM articles a 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE a.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    await pool.query(
      'UPDATE articles SET view_count = view_count + 1 WHERE slug = $1',
      [slug]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new article (protected route)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      category_id,
      author,
      is_featured
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO articles 
       (title, slug, content, summary, image_url, category_id, author, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, slug, content, summary, image_url, category_id, author, is_featured]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article (protected route)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      summary,
      category_id,
      author,
      is_featured
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');

    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await pool.query(
      `UPDATE articles 
       SET title = $1, slug = $2, content = $3, summary = $4, 
           category_id = $5, author = $6, is_featured = $7, 
           updated_at = CURRENT_TIMESTAMP
       ${image_url ? ', image_url = $8' : ''}
       WHERE id = $${image_url ? '9' : '8'}
       RETURNING *`,
      image_url
        ? [title, slug, content, summary, category_id, author, is_featured, image_url, id]
        : [title, slug, content, summary, category_id, author, is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article (protected route)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 