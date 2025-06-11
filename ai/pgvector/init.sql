create extension if not exists vector;
CREATE TABLE vec_test (
  id SERIAL PRIMARY KEY,
  label TEXT,
  vec VECTOR(3)
);
INSERT INTO vec_test (label, vec)
VALUES -- Same direction, different magnitude
  ('v1', '[1, 2, 3]'),
  ('v2', '[2, 4, 6]'),
  -- Different direction
  ('v3', '[3, 2, 1]'),
  -- Orthogonal
  ('v4', '[0, 0, 1]'),
  -- Opposite direction
  ('v5', '[-1, -2, -3]');
