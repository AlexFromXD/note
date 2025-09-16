CREATE TABLE IF NOT EXISTS data (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO data (name)
VALUES ('Sample Data 1'),
  ('Sample Data 2'),
  ('Sample Data 3');
