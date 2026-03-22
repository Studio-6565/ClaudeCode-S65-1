CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS crew (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  skills TEXT,
  bio TEXT,
  portal_code TEXT UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS crew_unavailability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crew_id INTEGER NOT NULL REFERENCES crew(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  note TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Lead',
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  is_shoot INTEGER DEFAULT 0,
  shoot_location TEXT,
  shoot_address TEXT,
  budget_revenue REAL DEFAULT 0,
  budget_cost REAL DEFAULT 0,
  rental_cost REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_crew (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  crew_id INTEGER NOT NULL REFERENCES crew(id) ON DELETE CASCADE,
  role_on_project TEXT,
  day_rate REAL DEFAULT 0,
  days_worked REAL DEFAULT 0,
  confirmed INTEGER DEFAULT NULL,
  UNIQUE(project_id, crew_id)
);

CREATE TABLE IF NOT EXISTS project_deliverables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  due_date TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  start_datetime TEXT NOT NULL,
  end_datetime TEXT,
  location TEXT,
  address TEXT,
  parking_notes TEXT,
  call_time TEXT,
  general_notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_crew (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  crew_id INTEGER NOT NULL REFERENCES crew(id) ON DELETE CASCADE,
  personal_call_time TEXT,
  UNIQUE(event_id, crew_id)
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT,
  amount REAL DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  issued_date TEXT,
  due_date TEXT,
  paid_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invoice_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  paid_date TEXT NOT NULL,
  method TEXT,
  notes TEXT
);
