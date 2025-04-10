-- First, create tags table and article_tags relationship
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Insert popular tags
INSERT INTO tags (name, slug) 
SELECT 'Trending', 'trending' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'trending');
INSERT INTO tags (name, slug)
SELECT 'Must Read', 'must-read' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'must-read');
INSERT INTO tags (name, slug)
SELECT 'Top Story', 'top-story' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'top-story');
INSERT INTO tags (name, slug)
SELECT 'Viral', 'viral' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'viral');
INSERT INTO tags (name, slug)
SELECT 'Breaking News', 'breaking-news' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'breaking-news');
INSERT INTO tags (name, slug)
SELECT 'Tech Trends', 'tech-trends' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'tech-trends');
INSERT INTO tags (name, slug)
SELECT 'Innovation', 'innovation' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'innovation');
INSERT INTO tags (name, slug)
SELECT 'Future Tech', 'future-tech' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'future-tech');

-- First, check if categories exist, only insert if they don't
INSERT INTO categories (name, slug)
SELECT 'Politics', 'politics' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'politics');
INSERT INTO categories (name, slug)
SELECT 'Technology', 'technology' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'technology');
INSERT INTO categories (name, slug)
SELECT 'Sports', 'sports' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'sports');
INSERT INTO categories (name, slug)
SELECT 'Business', 'business' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'business');
INSERT INTO categories (name, slug)
SELECT 'Entertainment', 'entertainment' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'entertainment');
INSERT INTO categories (name, slug)
SELECT 'Health', 'health' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'health');

-- Add articles with real-time dates and viral-optimized content
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'BREAKING: Revolutionary AI Breakthrough Changes Everything in 2024', 
  'breaking-ai-revolution-2024', 
  'Groundbreaking AI Technology Transforms Industry Standards

MUST-READ Highlights:
- Revolutionary AI system surpasses human capabilities
- Game-changing implications for healthcare and technology
- Exclusive insights from leading AI researchers
- What this means for the future of technology

Industry experts are calling this the biggest technological leap of the decade. The new AI system, developed by leading researchers, demonstrates unprecedented capabilities in problem-solving and data analysis.

Key Breakthroughs:
- 10x faster processing than current systems
- Revolutionary natural language understanding
- Breakthrough in computer vision technology
- Real-world application potential

Expert Opinions:
"This is a turning point in AI history" - Dr. Tech Expert
"Will revolutionize how we approach technology" - Industry Leader

What This Means For You:
- Improved healthcare diagnostics
- Enhanced user experiences
- Smarter personal assistants
- Revolutionary business applications

Stay ahead of the curve and learn how this breakthrough will impact your future...', 
  'Revolutionary AI breakthrough in 2024 surpasses all expectations with game-changing capabilities', 
  'https://images.unsplash.com/photo-1677442136019-21780ecad995', 
  (SELECT id FROM categories WHERE slug = 'technology'), 
  true, 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'breaking-ai-revolution-2024'
);

-- Add viral tags to the AI article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a, tags t
WHERE a.slug = 'breaking-ai-revolution-2024'
  AND t.slug IN ('trending', 'viral', 'breaking-news', 'tech-trends', 'innovation', 'must-read')
  AND NOT EXISTS (
    SELECT 1 FROM article_tags 
    WHERE article_id = a.id AND tag_id = t.id
  );

-- Your personal brand article with viral optimization
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Rising Tech Star: Siddhesh Ghargane''s Innovative Journey in Development', 
  'siddhesh-ghargane-tech-innovation', 
  'Exclusive: Inside the Journey of a Rising Tech Innovator

TRENDING Developer Story:
- From Beginner to Tech Innovation Leader
- Revolutionary Approach to Development
- Game-Changing Project Insights
- Future of Technology Development

Key Achievements:
- Breakthrough Full Stack Development Projects
- Innovative Technical Leadership
- Cutting-Edge Technology Implementation
- Industry-Leading Solutions

Expert Insights:
"The future of development lies in innovative thinking and adaptable solutions. My journey represents the evolving landscape of technology and the endless possibilities it offers."

Technology Impact:
- Revolutionary Project Implementations
- Scalable Solution Architecture
- Next-Generation Development Practices
- Industry-Leading Standards

Join the journey of innovation and discover the future of technology development...', 
  'Rising tech innovator revolutionizes development approaches with breakthrough solutions', 
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 
  (SELECT id FROM categories WHERE slug = 'technology'), 
  true, 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'siddhesh-ghargane-tech-innovation'
);

-- Add viral tags to your personal article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a, tags t
WHERE a.slug = 'siddhesh-ghargane-tech-innovation'
  AND t.slug IN ('trending', 'innovation', 'tech-trends', 'future-tech', 'must-read')
  AND NOT EXISTS (
    SELECT 1 FROM article_tags 
    WHERE article_id = a.id AND tag_id = t.id
  );

-- Article from yesterday
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Major Sports Tournament Results', 
  'sports-tournament-results', 
  'Complete coverage of yesterday''s matches...
Highlights:
- Final scores
- Player statistics
- Post-match analysis', 
  'Comprehensive coverage of the tournament finals', 
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', 
  (SELECT id FROM categories WHERE slug = 'sports'), 
  true, 
  NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'sports-tournament-results'
);

-- Article from 2 days ago
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Global Economic Summit', 
  'global-economic-summit-2024', 
  'Key decisions from the economic summit...
Main points:
- New trade agreements
- Economic forecasts
- International cooperation initiatives', 
  'World leaders agree on new economic framework', 
  'https://images.unsplash.com/photo-1542222780-b08589deaa97', 
  (SELECT id FROM categories WHERE slug = 'business'), 
  false, 
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'global-economic-summit-2024'
);

-- Article from 3 days ago
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Entertainment Industry Awards', 
  'entertainment-awards-2024', 
  'Complete coverage of the awards ceremony...
Highlights:
- Award winners
- Best moments
- Red carpet highlights', 
  'Annual entertainment awards ceremony celebrates excellence', 
  'https://images.unsplash.com/photo-1586899028174-e7098604235b', 
  (SELECT id FROM categories WHERE slug = 'entertainment'), 
  false, 
  NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'entertainment-awards-2024'
);

-- Article from a week ago
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Healthcare Innovation Report', 
  'healthcare-innovation-report', 
  'Latest developments in healthcare technology...
Key innovations:
- New treatment methods
- Medical device breakthroughs
- Research findings', 
  'Revolutionary advances in medical technology', 
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', 
  (SELECT id FROM categories WHERE slug = 'health'), 
  false, 
  NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'healthcare-innovation-report'
);

-- Your custom article
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'Siddhesh Ghargane: Developer Journey', 
  'siddhesh-developer-journey', 
  'A Journey Through Development
Key Points:
- Full Stack Development Experience
- Project Leadership
- Technical Innovation
- Continuous Learning

Throughout my career, I have focused on creating efficient and scalable solutions...', 
  'A developer''s journey through technology and innovation', 
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 
  (SELECT id FROM categories WHERE slug = 'technology'), 
  true, 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'siddhesh-developer-journey'
);

-- First, add more SEO-friendly tags
INSERT INTO tags (name, slug)
SELECT 'Global News', 'global-news' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'global-news');
INSERT INTO tags (name, slug)
SELECT 'World Affairs', 'world-affairs' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'world-affairs');
INSERT INTO tags (name, slug)
SELECT 'Breaking News', 'breaking-news' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'breaking-news');
INSERT INTO tags (name, slug)
SELECT 'Latest Updates', 'latest-updates' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'latest-updates');
INSERT INTO tags (name, slug)
SELECT 'International', 'international' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'international');
INSERT INTO tags (name, slug)
SELECT 'Top Headlines', 'top-headlines' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'top-headlines');

-- Example of a viral global news article
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) 
SELECT 
  'BREAKING: Major Global Summit Reshapes International Relations 2024', 
  'global-summit-breakthrough-2024', 
  'EXCLUSIVE: Groundbreaking International Agreement Transforms Global Landscape

TRENDING Highlights:
- Historic agreement between world powers
- Revolutionary economic partnerships
- Climate change breakthrough
- Global security framework

Key Developments:
- Unprecedented cooperation between nations
- Massive economic impact worldwide
- Game-changing environmental commitments
- New era of international relations

Expert Analysis:
"This marks a pivotal moment in global politics" - Leading Political Analyst
"A new chapter in international cooperation" - Global Affairs Expert

Impact on Global Citizens:
- Enhanced international trade
- Improved global security
- Environmental protection measures
- Economic opportunities worldwide

Stay informed about this transformative global development...', 
  'Historic global summit achieves breakthrough agreement, reshaping international relations', 
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620', 
  (SELECT id FROM categories WHERE slug = 'politics'), 
  true, 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM articles 
  WHERE slug = 'global-summit-breakthrough-2024'
);

-- Add viral and SEO tags to the global article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a, tags t
WHERE a.slug = 'global-summit-breakthrough-2024'
  AND t.slug IN (
    'trending',
    'viral',
    'breaking-news',
    'global-news',
    'world-affairs',
    'international',
    'top-headlines',
    'latest-updates',
    'must-read',
    'top-story'
  )
  AND NOT EXISTS (
    SELECT 1 FROM article_tags 
    WHERE article_id = a.id AND tag_id = t.id
  ); 