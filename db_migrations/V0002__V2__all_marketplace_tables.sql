CREATE TABLE abk_sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  owner_name VARCHAR(200),
  avatar_emoji VARCHAR(20) DEFAULT '',
  description TEXT,
  location VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  response_time VARCHAR(50) DEFAULT '24h',
  verified BOOLEAN DEFAULT FALSE,
  verified_level VARCHAR(20) DEFAULT 'none',
  verified_at TIMESTAMP,
  since_year INTEGER DEFAULT 2024,
  status VARCHAR(20) DEFAULT 'pending',
  email VARCHAR(200),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_products (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER,
  category_id INTEGER,
  name VARCHAR(300) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image_emoji VARCHAR(20) DEFAULT '',
  image_url TEXT,
  weight VARCHAR(50),
  badge VARCHAR(50),
  badge_type VARCHAR(20),
  in_stock BOOLEAN DEFAULT TRUE,
  stock_qty INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  has_personal_delivery BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_buyers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  role VARCHAR(20) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_orders (
  id VARCHAR(20) PRIMARY KEY,
  buyer_id INTEGER,
  seller_id INTEGER,
  status VARCHAR(30) DEFAULT 'processing',
  delivery_method VARCHAR(30) DEFAULT 'courier',
  delivery_price DECIMAL(10,2) DEFAULT 0,
  address TEXT,
  phone VARCHAR(50),
  comment TEXT,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(20),
  product_id INTEGER,
  product_name VARCHAR(300) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE abk_reviews (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER,
  product_id INTEGER,
  order_id VARCHAR(20),
  reviewer_name VARCHAR(200) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  product_id INTEGER,
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_favorites (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  product_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE abk_seller_applications (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER,
  docs_submitted BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);
