const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

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

const insertSampleData = `
  -- First, insert categories
  INSERT INTO categories (name, slug) VALUES
  ('Politics', 'politics'),
  ('Technology', 'technology'),
  ('Sports', 'sports'),
  ('Business', 'business'),
  ('Entertainment', 'entertainment'),
  ('Health', 'health');

  -- Then, insert articles with real content
  INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) VALUES
  ('AI Revolution in Healthcare: Breakthrough Diagnostics', 
   'ai-healthcare-breakthrough-2024', 
   'Artificial Intelligence is transforming healthcare diagnostics with unprecedented accuracy. Recent developments show AI systems achieving 95% accuracy in early disease detection.

Key Breakthroughs:
- Early cancer detection using AI imaging
- Real-time patient monitoring systems
- Personalized treatment recommendations
- Reduced diagnosis time by 60%

Medical professionals worldwide are adopting these technologies, marking a new era in healthcare delivery.', 
   'AI systems achieve 95% accuracy in early disease detection, revolutionizing healthcare diagnostics', 
   'https://images.unsplash.com/photo-1576091160550-2173dba999ef', 
   (SELECT id FROM categories WHERE slug = 'health'), 
   true, 
   CURRENT_TIMESTAMP),

  ('Global Climate Summit Reaches Historic Agreement', 
   'climate-summit-agreement-2024', 
   'World leaders have reached a landmark agreement at the Global Climate Summit, pledging to reduce carbon emissions by 50% by 2030.

Key Points:
- Unprecedented commitment from 195 countries
- $100 billion climate fund established
- New renewable energy targets
- Phase-out plan for fossil fuels
- Global carbon pricing mechanism

Environmental experts call this a turning point in the fight against climate change.', 
   'Historic climate agreement: 195 countries commit to 50% emission reduction by 2030', 
   'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', 
   (SELECT id FROM categories WHERE slug = 'politics'), 
   true, 
   CURRENT_TIMESTAMP - INTERVAL '1 day'),

  ('Tech Giants Launch Revolutionary Quantum Computing Platform', 
   'quantum-computing-platform-launch', 
   'Leading tech companies have unveiled a groundbreaking quantum computing platform accessible to businesses worldwide.

Technical Specifications:
- 1000+ qubit processing power
- Cloud-based quantum access
- Advanced error correction
- Integration with classical systems
- Developer-friendly SDK

This development marks a significant step toward practical quantum computing applications.', 
   'New quantum computing platform brings unprecedented processing power to businesses', 
   'https://images.unsplash.com/photo-1518770660439-4636190af475', 
   (SELECT id FROM categories WHERE slug = 'technology'), 
   true, 
   CURRENT_TIMESTAMP - INTERVAL '2 days'),

  ('Asian Games 2024: Record-Breaking Performances', 
   'asian-games-2024-highlights', 
   'The 2024 Asian Games have witnessed multiple world records and outstanding athletic achievements.

Highlights:
- New world record in 100m sprint
- Historic medal haul for emerging nations
- Breakthrough performances in swimming
- Innovation in sports technology
- Rising stars to watch

The games have showcased the rising standard of Asian athletics.', 
   'Multiple world records broken at the 2024 Asian Games', 
   'https://images.unsplash.com/photo-1461896836934-ffe607ba8211', 
   (SELECT id FROM categories WHERE slug = 'sports'), 
   false, 
   CURRENT_TIMESTAMP - INTERVAL '3 days'),

  ('Global Markets Rally as Tech Sector Soars', 
   'global-markets-tech-rally-2024', 
   'Stock markets worldwide have reached new highs, driven by unprecedented growth in the technology sector.

Market Highlights:
- Tech index up 25% year-to-date
- AI companies leading the surge
- Record venture capital investments
- Strong earnings reports
- Positive economic indicators

Analysts predict sustained growth through 2024.', 
   'Technology sector leads global market rally with 25% growth', 
   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3', 
   (SELECT id FROM categories WHERE slug = 'business'), 
   false, 
   CURRENT_TIMESTAMP - INTERVAL '4 days'),

  ('Streaming Revolution: New Era of Entertainment', 
   'streaming-entertainment-revolution', 
   'The entertainment industry is witnessing a major shift as streaming platforms introduce innovative content formats.

Latest Developments:
- Interactive storytelling features
- AI-powered personalization
- Virtual reality integration
- Live global premieres
- Cross-platform compatibility

These changes are reshaping how audiences consume media worldwide.', 
   'Streaming platforms revolutionize entertainment with interactive and AI-powered content', 
   'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37', 
   (SELECT id FROM categories WHERE slug = 'entertainment'), 
   false, 
   CURRENT_TIMESTAMP - INTERVAL '5 days')
`;

async function initializeDatabase() {
  try {
    // Create tables
    await pool.query(createTables);
    console.log('Tables created successfully');

    // First, clear existing data
    await pool.query('TRUNCATE categories, articles CASCADE');
    console.log('Existing data cleared');

    // Insert new sample data
    await pool.query(insertSampleData);
    console.log('Sample data inserted successfully');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase(); 