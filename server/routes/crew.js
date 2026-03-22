const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/', (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = db.prepare(`SELECT * FROM crew WHERE name LIKE ? OR role LIKE ? OR skills LIKE ? ORDER BY name`).all(`%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    rows = db.prepare('SELECT * FROM crew ORDER BY name').all();
  }
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const member = db.prepare('SELECT * FROM crew WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ error: 'Not found' });
  const projects = db.prepare(`
    SELECT p.id, p.name, p.status, p.start_date, p.end_date, pc.role_on_project, pc.day_rate, pc.days_worked, pc.confirmed
    FROM project_crew pc JOIN projects p ON pc.project_id = p.id
    WHERE pc.crew_id = ? ORDER BY p.start_date DESC
  `).all(req.params.id);
  const unavailability = db.prepare('SELECT * FROM crew_unavailability WHERE crew_id = ? ORDER BY date').all(req.params.id);
  res.json({ ...member, projects, unavailability });
});

router.post('/', (req, res) => {
  const { name, email, phone, role, skills, bio, portal_code } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  if (portal_code) {
    const existing = db.prepare('SELECT id FROM crew WHERE portal_code = ?').get(portal_code);
    if (existing) return res.status(400).json({ error: 'Portal code already in use' });
  }
  const result = db.prepare('INSERT INTO crew (name, email, phone, role, skills, bio, portal_code) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, email, phone, role, skills, bio, portal_code || null);
  res.status(201).json(db.prepare('SELECT * FROM crew WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, email, phone, role, skills, bio, portal_code } = req.body;
  const existing = db.prepare('SELECT id FROM crew WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (portal_code) {
    const conflict = db.prepare('SELECT id FROM crew WHERE portal_code = ? AND id != ?').get(portal_code, req.params.id);
    if (conflict) return res.status(400).json({ error: 'Portal code already in use' });
  }
  db.prepare('UPDATE crew SET name=?, email=?, phone=?, role=?, skills=?, bio=?, portal_code=? WHERE id=?').run(name, email, phone, role, skills, bio, portal_code || null, req.params.id);
  res.json(db.prepare('SELECT * FROM crew WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM crew WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Unavailability
router.get('/:id/unavailability', (req, res) => {
  res.json(db.prepare('SELECT * FROM crew_unavailability WHERE crew_id = ? ORDER BY date').all(req.params.id));
});

router.post('/:id/unavailability', (req, res) => {
  const { date, note } = req.body;
  if (!date) return res.status(400).json({ error: 'Date required' });
  const result = db.prepare('INSERT INTO crew_unavailability (crew_id, date, note) VALUES (?, ?, ?)').run(req.params.id, date, note);
  res.status(201).json(db.prepare('SELECT * FROM crew_unavailability WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/:id/unavailability/:dateId', (req, res) => {
  db.prepare('DELETE FROM crew_unavailability WHERE id = ? AND crew_id = ?').run(req.params.dateId, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
