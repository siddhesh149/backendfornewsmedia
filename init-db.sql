-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, slug) VALUES
('Politics', 'politics'),
('Technology', 'technology'),
('Sports', 'sports'),
('Business', 'business'),
('Entertainment', 'entertainment'),
('Health', 'health');

-- Insert sample articles
INSERT INTO articles (title, slug, content, summary, image_url, category_id, featured, published_at) VALUES
('India''s Economic Growth Surges to 7.8% in Q1', 
'india-economic-growth-q1-2024', 
'India''s economy grew at a robust pace of 7.8% in the first quarter of 2024, surpassing expectations and cementing its position as one of the fastest-growing major economies. The growth was driven by strong performance in manufacturing and services sectors, with domestic consumption remaining resilient despite global headwinds.

The Ministry of Statistics and Programme Implementation released the data showing significant improvements across key sectors. Manufacturing grew by 8.2%, while services expanded at 7.5%. Agriculture showed moderate growth at 3.2%.

Experts attribute this growth to several factors:
1. Strong domestic demand
2. Increased government spending on infrastructure
3. Recovery in private investment
4. Robust performance of the digital economy

The Finance Minister stated that this growth trajectory positions India well to achieve its target of becoming a $5 trillion economy by 2025.', 
'India maintains its position as the fastest-growing major economy with 7.8% growth in Q1 2024', 
'https://images.unsplash.com/photo-1542728928-1413d1894ed1', 
(SELECT id FROM categories WHERE slug = 'business'), 
true, 
NOW()),

('New AI Breakthrough in Medical Diagnosis', 
'ai-breakthrough-medical-diagnosis', 
'Scientists have developed a new artificial intelligence system that can diagnose multiple diseases with unprecedented accuracy. The system, developed by a team of international researchers, uses deep learning algorithms to analyze medical images and patient data.

The AI system has shown remarkable accuracy in detecting:
- Early-stage cancers
- Cardiovascular conditions
- Neurological disorders
- Rare genetic diseases

Clinical trials have demonstrated a 99% accuracy rate, surpassing human diagnosis in several cases. The system is particularly effective in detecting subtle patterns that might be missed by human observers.

This breakthrough could revolutionize healthcare delivery, especially in underserved areas where specialist doctors are scarce.', 
'Revolutionary AI system achieves 99% accuracy in disease diagnosis', 
'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144', 
(SELECT id FROM categories WHERE slug = 'technology'), 
true, 
NOW() - INTERVAL '1 day'),

('World Cup Final: Epic Showdown Expected', 
'world-cup-final-preview-2024', 
'The stage is set for an epic showdown in the World Cup final as two powerhouse teams prepare to battle for glory. The match, scheduled for this Sunday, is expected to draw a global audience of over 1 billion viewers.

Both teams have shown exceptional form throughout the tournament:
- Team A: Undefeated in their last 12 matches
- Team B: Highest scoring team in the tournament

Key players to watch:
1. Star striker John Smith with 8 goals in the tournament
2. Goalkeeper Maria Rodriguez with 5 clean sheets
3. Midfielder Carlos Santos, tournament''s assist leader

The match will be played at the iconic Stadium One, known for its electric atmosphere and historic moments.', 
'Preview of the most anticipated World Cup final in recent history', 
'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253', 
(SELECT id FROM categories WHERE slug = 'sports'), 
true, 
NOW() - INTERVAL '2 days'),

('Major Climate Agreement Reached at Global Summit', 
'global-climate-summit-agreement-2024', 
'World leaders have reached a landmark agreement to reduce global emissions by 50% by 2030. The historic deal, signed by 195 countries, represents the most ambitious climate action plan to date.

Key points of the agreement:
- 50% reduction in greenhouse gas emissions by 2030
- $100 billion annual fund for developing nations
- Ban on new coal power plants from 2025
- Global carbon pricing mechanism

The agreement also includes provisions for:
1. Renewable energy investment
2. Forest conservation
3. Clean technology transfer
4. Climate adaptation measures

Environmental experts call this a turning point in the fight against climate change.', 
'Historic climate agreement sets ambitious targets for emission reduction', 
'https://images.unsplash.com/photo-1535932766093-c7e4146c2d2c', 
(SELECT id FROM categories WHERE slug = 'politics'), 
true, 
NOW() - INTERVAL '3 days'),

('Breakthrough in Renewable Energy Storage', 
'renewable-energy-storage-breakthrough', 
'Scientists announce a revolutionary new battery technology that could solve the renewable energy storage challenge. The new technology promises to store energy at one-tenth the cost of current solutions while offering ten times the capacity.

Technical specifications:
- Energy density: 400 Wh/kg
- Lifecycle: 10,000+ cycles
- Cost: $50/kWh
- Environmental impact: Fully recyclable

This breakthrough could accelerate the global transition to renewable energy by solving the intermittency problem of solar and wind power.', 
'New battery technology promises to revolutionize renewable energy sector', 
'https://images.unsplash.com/photo-1509391366360-2e959784a276', 
(SELECT id FROM categories WHERE slug = 'technology'), 
false, 
NOW() - INTERVAL '4 days'); 