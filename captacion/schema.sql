CREATE TABLE IF NOT EXISTS leads (
  id        TEXT PRIMARY KEY,
  creado    TEXT NOT NULL,
  nombre    TEXT,
  contacto  TEXT,
  negocio   TEXT,
  necesidad TEXT,
  servicio  TEXT,
  urgencia  TEXT,
  notas     TEXT,
  atendido  INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_leads_creado ON leads (creado DESC);
CREATE INDEX IF NOT EXISTS idx_leads_pendientes ON leads (atendido, creado DESC);
