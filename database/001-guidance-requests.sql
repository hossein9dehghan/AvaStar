CREATE TABLE IF NOT EXISTS guidance_requests (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  contact_key TEXT NOT NULL,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_requests_contact_created
  ON guidance_requests (contact_key, created_at);
