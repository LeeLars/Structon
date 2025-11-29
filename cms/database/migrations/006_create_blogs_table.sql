-- Blog posts table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  author_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog categories/tags (optional, for future use)
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_tag_relations (
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
