-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    summary TEXT,
    image_url VARCHAR(255),
    category_id INTEGER REFERENCES categories(id),
    author VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
    ('Latest News', 'latest-news'),
    ('Politics', 'politics'),
    ('Business', 'business'),
    ('Technology', 'technology'),
    ('Sports', 'sports'),
    ('Entertainment', 'entertainment'),
    ('World', 'world'),
    ('Science', 'science'),
    ('Health', 'health'),
    ('Education', 'education')
ON CONFLICT (slug) DO NOTHING; 