const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-vercel-domain.vercel.app']
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/api/articles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      LEFT JOIN categories ON articles.category_id = categories.id 
      ORDER BY articles.published_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      LEFT JOIN categories ON articles.category_id = categories.id 
      WHERE articles.slug = $1
    `, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete article endpoint
app.delete('/api/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First check if article exists
    const checkResult = await pool.query('SELECT id FROM articles WHERE slug = $1', [slug]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Delete the article
    await pool.query('DELETE FROM articles WHERE slug = $1', [slug]);
    
    res.json({ message: `Article '${slug}' deleted successfully` });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories/:slug/articles', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      JOIN categories ON articles.category_id = categories.id 
      WHERE categories.slug = $1 
      ORDER BY articles.published_at DESC
    `, [slug]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 