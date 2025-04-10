const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addArticle(articleData) {
  const {
    title,
    slug,
    content,
    summary,
    image_url,
    category,
    featured
  } = articleData;

  const query = `
    INSERT INTO articles (
      title, 
      slug, 
      content, 
      summary, 
      image_url, 
      category_id, 
      featured, 
      published_at
    ) 
    VALUES (
      $1, 
      $2, 
      $3, 
      $4, 
      $5, 
      (SELECT id FROM categories WHERE slug = $6), 
      $7, 
      NOW()
    )
    RETURNING id;
  `;

  try {
    const result = await pool.query(query, [
      title,
      slug,
      content,
      summary,
      image_url,
      category,
      featured
    ]);
    console.log('Article added successfully with ID:', result.rows[0].id);
  } catch (error) {
    console.error('Error adding article:', error);
  }
}

// Example usage:
const newArticle = {
  title: 'Example Article Title',
  slug: 'example-article-slug',
  content: 'This is the full content of your article...',
  summary: 'A brief summary of your article',
  image_url: 'https://images.unsplash.com/photo-example',
  category: 'technology', // Use one of: politics, technology, sports, business, entertainment, health
  featured: false
};

// Add the article
addArticle(newArticle)
  .then(() => pool.end())
  .catch(console.error); 