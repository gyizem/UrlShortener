CREATE TABLE IF NOT EXISTS urls(
    id UUID PRIMARY KEY,
    original_url text,
    alias VARCHAR UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    click_count INTEGER
);
CREATE TABLE IF NOT EXISTS visits(
    id UUID PRIMARY KEY,
    alias VARCHAR,
    ip_address VARCHAR,
    country VARCHAR,
    city VARCHAR,
    visited_at TIMESTAMP DEFAULT now()
);