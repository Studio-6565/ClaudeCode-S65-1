const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/', (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = db.prepare(`SELECT * FROM clients WHERE name LIKE ? OR email LIKE ? OR company LIKE ? ORDER BY name`).all(`%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    rows = db.prepare('SELECT * FROM clients ORDER BY name').all();
  }
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  const projects = db.prepare('SELECT id, name, status, start_date, end_date, budget_revenue FROM projects WHERE client_id = ? ORDER BY created_at DESC').all(req.params.id);
  const invoices = db.prepare('SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...client, projects, invoices });
});

router.post('/', (req, res) => {
  const { name, email, phone, company, notes, tags } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const result = db.prepare('INSERT INTO clients (name, email, phone, company, notes, tags) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, phone, company, notes, tags);
  res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, email, phone, company, notes, tags } = req.body;
  const existing = db.prepare('SELECT id FROM clients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE clients SET name=?, email=?, phone=?, company=?, notes=?, tags=? WHERE id=?').run(name, email, phone, company, notes, tags, req.params.id);
  res.json(db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
