const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { sendCrewAssignmentEmail } = require('../services/email');

router.use(requireAdmin);

function getFinancials(projectId) {
  const p = db.prepare('SELECT budget_revenue, budget_cost, rental_cost FROM projects WHERE id = ?').get(projectId);
  if (!p) return null;
  const crewRows = db.prepare('SELECT day_rate, days_worked FROM project_crew WHERE project_id = ?').all(projectId);
  const crewCost = crewRows.reduce((s, r) => s + (r.day_rate || 0) * (r.days_worked || 0), 0);
  const totalCost = crewCost + (p.rental_cost || 0) + (p.budget_cost || 0);
  const profit = (p.budget_revenue || 0) - totalCost;
  const margin = p.budget_revenue ? (profit / p.budget_revenue) * 100 : 0;
  return { revenue: p.budget_revenue, crewCost, rentalCost: p.rental_cost, otherCost: p.budget_cost, totalCost, profit, margin };
}

router.get('/', (req, res) => {
  const { status, client_id, search } = req.query;
  let q = `SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id WHERE 1=1`;
  const params = [];
  if (status) { q += ' AND p.status = ?'; params.push(status); }
  if (client_id) { q += ' AND p.client_id = ?'; params.push(client_id); }
  if (search) { q += ' AND p.name LIKE ?'; params.push(`%${search}%`); }
  q += ' ORDER BY p.created_at DESC';
  const rows = db.prepare(q).all(...params);
  const result = rows.map(r => ({ ...r, financials: getFinancials(r.id) }));
  res.json(result);
});

router.get('/:id', (req, res) => {
  const project = db.prepare(`
    SELECT p.*, c.name as client_name, c.email as client_email, c.phone as client_phone
    FROM projects p LEFT JOIN clients c ON p.client_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });

  const crew = db.prepare(`
    SELECT pc.*, cr.name, cr.email, cr.phone, cr.role
    FROM project_crew pc JOIN crew cr ON pc.crew_id = cr.id
    WHERE pc.project_id = ?
  `).all(req.params.id);

  const deliverables = db.prepare('SELECT * FROM project_deliverables WHERE project_id = ? ORDER BY id').all(req.params.id);
  const events = db.prepare(`SELECT * FROM events WHERE project_id = ? ORDER BY start_datetime`).all(req.params.id);
  const invoices = db.prepare('SELECT * FROM invoices WHERE project_id = ? ORDER BY created_at DESC').all(req.params.id);
  const financials = getFinancials(req.params.id);

  res.json({ ...project, crew, deliverables, events, invoices, financials });
});

router.post('/', (req, res) => {
  const { name, client_id, status, description, start_date, end_date, is_shoot, shoot_location, shoot_address, budget_revenue, budget_cost, rental_cost, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const result = db.prepare(`INSERT INTO projects (name, client_id, status, description, start_date, end_date, is_shoot, shoot_location, shoot_address, budget_revenue, budget_cost, rental_cost, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(name, client_id, status || 'Lead', description, start_date, end_date, is_shoot ? 1 : 0, shoot_location, shoot_address, budget_revenue || 0, budget_cost || 0, rental_cost || 0, notes);
  res.status(201).json(db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, client_id, status, description, start_date, end_date, is_shoot, shoot_location, shoot_address, budget_revenue, budget_cost, rental_cost, notes } = req.body;
  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare(`UPDATE projects SET name=?, client_id=?, status=?, description=?, start_date=?, end_date=?, is_shoot=?, shoot_location=?, shoot_address=?, budget_revenue=?, budget_cost=?, rental_cost=?, notes=? WHERE id=?`).run(name, client_id, status, description, start_date, end_date, is_shoot ? 1 : 0, shoot_location, shoot_address, budget_revenue || 0, budget_cost || 0, rental_cost || 0, notes, req.params.id);
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Crew assignment
router.post('/:id/crew', async (req, res) => {
  const { crew_id, role_on_project, day_rate, days_worked } = req.body;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const crewMember = db.prepare('SELECT * FROM crew WHERE id = ?').get(crew_id);
  if (!crewMember) return res.status(404).json({ error: 'Crew member not found' });

  try {
    db.prepare('INSERT INTO project_crew (project_id, crew_id, role_on_project, day_rate, days_worked) VALUES (?, ?, ?, ?, ?)').run(req.params.id, crew_id, role_on_project, day_rate || 0, days_worked || 0);
  } catch {
    return res.status(409).json({ error: 'Crew already assigned' });
  }

  const assignment = db.prepare('SELECT * FROM project_crew WHERE project_id = ? AND crew_id = ?').get(req.params.id, crew_id);

  if (crewMember.email) {
    sendCrewAssignmentEmail({ crew: crewMember, project, assignment }).catch(e => console.error('Email error:', e));
  }

  res.status(201).json(assignment);
});

router.put('/:id/crew/:crewId', (req, res) => {
  const { role_on_project, day_rate, days_worked } = req.body;
  db.prepare('UPDATE project_crew SET role_on_project=?, day_rate=?, days_worked=? WHERE project_id=? AND crew_id=?').run(role_on_project, day_rate || 0, days_worked || 0, req.params.id, req.params.crewId);
  res.json(db.prepare('SELECT * FROM project_crew WHERE project_id=? AND crew_id=?').get(req.params.id, req.params.crewId));
});

router.delete('/:id/crew/:crewId', (req, res) => {
  db.prepare('DELETE FROM project_crew WHERE project_id=? AND crew_id=?').run(req.params.id, req.params.crewId);
  res.json({ ok: true });
});

// Deliverables
router.get('/:id/deliverables', (req, res) => {
  res.json(db.prepare('SELECT * FROM project_deliverables WHERE project_id = ? ORDER BY id').all(req.params.id));
});

router.post('/:id/deliverables', (req, res) => {
  const { title, status, due_date, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const result = db.prepare('INSERT INTO project_deliverables (project_id, title, status, due_date, notes) VALUES (?, ?, ?, ?, ?)').run(req.params.id, title, status || 'Pending', due_date, notes);
  res.status(201).json(db.prepare('SELECT * FROM project_deliverables WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id/deliverables/:did', (req, res) => {
  const { title, status, due_date, notes } = req.body;
  db.prepare('UPDATE project_deliverables SET title=?, status=?, due_date=?, notes=? WHERE id=? AND project_id=?').run(title, status, due_date, notes, req.params.did, req.params.id);
  res.json(db.prepare('SELECT * FROM project_deliverables WHERE id = ?').get(req.params.did));
});

router.delete('/:id/deliverables/:did', (req, res) => {
  db.prepare('DELETE FROM project_deliverables WHERE id=? AND project_id=?').run(req.params.did, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
