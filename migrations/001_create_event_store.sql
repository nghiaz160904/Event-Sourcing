CREATE TABLE IF NOT EXISTS event_store (
  id          BIGSERIAL PRIMARY KEY,
  aggregate_id UUID      NOT NULL,
  type        TEXT       NOT NULL,
  payload     JSONB      NOT NULL,
  created_at  TIMESTAMP  NOT NULL DEFAULT NOW()
);