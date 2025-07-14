CREATE TABLE IF NOT EXISTS post (
  id          UUID       PRIMARY KEY,
  author      TEXT       NOT NULL,
  title       TEXT       NOT NULL,
  content     TEXT       NOT NULL,
  created_at  TIMESTAMP  NOT NULL,
  deleted_at  TIMESTAMP
);