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

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// CORS configuration - Allow all origins in development
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://frontendfornewsmedia.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Root route for API health check
app.get('/', (req, res) => {
  res.json({ message: 'News API Server is running' });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Fetching categories...');
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    console.log('Categories fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get all articles with optional filtering
app.get('/api/articles', async (req, res) => {
  try {
    console.log('Fetching articles with params:', req.query);
    const { featured, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      LEFT JOIN categories ON articles.category_id = categories.id 
    `;
    
    const queryParams = [];
    if (featured === 'true') {
      query += ' WHERE articles.featured = true';
    }
    
    query += ' ORDER BY articles.published_at DESC';
    
    if (limit) {
      query += ' LIMIT $1';
      queryParams.push(limit);
    }
    
    console.log('Executing query:', query, queryParams);
    const result = await pool.query(query, queryParams);
    console.log('Articles fetched:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get single article by slug
app.get('/api/articles/:slug', async (req, res) => {
  try {
    console.log('Fetching article with slug:', req.params.slug);
    const result = await pool.query(`
      SELECT 
        articles.*, 
        categories.name as category_name 
      FROM articles 
      LEFT JOIN categories ON articles.category_id = categories.id 
      WHERE articles.slug = $1
    `, [req.params.slug]);
    
    if (result.rows.length === 0) {
      console.log('Article not found:', req.params.slug);
      return res.status(404).json({ error: 'Article not found' });
    }
    
    console.log('Article found:', result.rows[0].title);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Delete article
app.delete('/api/articles/:slug', async (req, res) => {
  try {
    console.log('Deleting article with slug:', req.params.slug);
    const result = await pool.query('DELETE FROM articles WHERE slug = $1 RETURNING *', [req.params.slug]);
    if (result.rows.length === 0) {
      console.log('Article not found for deletion:', req.params.slug);
      return res.status(404).json({ error: 'Article not found' });
    }
    console.log('Article deleted successfully:', req.params.slug);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

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
        VALUES (
          'Tech Innovation 2024', 
          'tech-innovation-2024',
          'Latest technology innovations in 2024 are reshaping our world. From AI breakthroughs to quantum computing advancements, the tech landscape is evolving rapidly.',
          'Exploring the latest technology trends and innovations of 2024',
          'https://images.unsplash.com/photo-1518770660439-4636190af475',
          (SELECT id FROM categories WHERE slug = 'technology'),
          true,
          CURRENT_TIMESTAMP
        );
      `;
      await pool.query(insertSampleData);
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Rethrow to handle in the calling function
  }
}

// Start server with database initialization
async function startServer() {
  try {
    if (process.env.SHOULD_INIT_DB === 'true') {
      console.log('Initializing database...');
      await initializeDatabase();
      console.log('Database initialization completed');
    }
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`CORS origin: ${process.env.FRONTEND_URL || '*'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 