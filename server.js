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
    ? [process.env.FRONTEND_URL || 'https://frontendfornewsmedia.vercel.app']
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database initialization function
async function initializeDatabase() {
  const createTables = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content TEXT NOT NULL,
      summary TEXT,
      image_url TEXT,
      category_id INTEGER REFERENCES categories(id),
      featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Create tables
    await pool.query(createTables);
    console.log('Tables created successfully');

    // Check if categories table is empty
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoriesResult.rows[0].count) === 0) {
      // Insert sample data
      const insertSampleData = `
        INSERT INTO categories (name, slug) VALUES
        ('Politics', 'politics'),
        ('Technology', 'technology'),
        ('Sports', 'sports'),
        ('Business', 'business'),
        ('Entertainment', 'entertainment'),
        ('Health', 'health');

        INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
        SELECT 
          'Tech Innovation 2024', 
          'tech-innovation-2024',
          'Latest technology innovations in 2024...',
          'Summary of tech innovations',
          'https://images.unsplash.com/photo-1518770660439-4636190af475',
          (SELECT id FROM categories WHERE slug = 'technology'),
          true,
          CURRENT_TIMESTAMP;
      `;
      await pool.query(insertSampleData);
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'News API Server is running' });
});

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
    const result = await pool.query(`
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      LEFT JOIN categories ON articles.category_id = categories.id 
      WHERE articles.slug = $1
    `, [req.params.slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/articles/:slug', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM articles WHERE slug = $1 RETURNING *', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
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

// Start server
if (process.env.SHOULD_INIT_DB === 'true') {
  initializeDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} 