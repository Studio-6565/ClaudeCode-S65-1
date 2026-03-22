const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { requireCrew, CREW_SECRET } = require('../middleware/auth');
const { verifyConfirmToken } = require('../services/email');

// POST /api/portal/login
router.post('/login', (req, res) => {
  const { portal_code } = req.body;
  if (!portal_code) return res.status(400).json({ error: 'Portal code required' });

  const member = db.prepare('SELECT * FROM crew WHERE portal_code = ?').get(portal_code.trim());
  if (!member) return res.status(401).json({ error: 'Invalid portal code' });

  const token = jwt.sign({ id: member.id, name: member.name, role: member.role }, CREW_SECRET, { expiresIn: '30d' });
  res.json({ token, crew: { id: member.id, name: member.name, role: member.role } });
});

// Confirm/Decline via email link (no auth required — uses signed token)
router.get('/confirm/:token', (req, res) => {
  const { action } = req.query;
  if (!['confirm', 'decline'].includes(action)) {
    return res.status(400).send('<h2>Invalid action.</h2>');
  }
  try {
    const payload = verifyConfirmToken(req.params.token);
    const confirmed = action === 'confirm' ? 1 : 0;
    db.prepare('UPDATE project_crew SET confirmed=? WHERE project_id=? AND crew_id=?').run(confirmed, payload.projectId, payload.crewId);
    const project = db.prepare('SELECT name FROM projects WHERE id = ?').get(payload.projectId);
    const crew = db.prepare('SELECT name FROM crew WHERE id = ?').get(payload.crewId);
    const msg = action === 'confirm' ? '✓ Confirmed!' : 'Declined.';
    const color = action === 'confirm' ? '#16a34a' : '#dc2626';
    return res.send(`
      <!DOCTYPE html><html><head><title>${msg}</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px">
        <h1 style="color:${color}">${msg}</h1>
        <p>Hi ${crew?.name || 'there'},</p>
        <p>Your response for <strong>${project?.name || 'this project'}</strong> has been recorded.</p>
        <p style="color:#666;font-size:14px">You can close this tab.</p>
      </body></html>
    `);
  } catch {
    return res.status(400).send('<h2>This link has expired or is invalid.</h2>');
  }
});

// All routes below require crew auth
router.use(requireCrew);

// GET /api/portal/me
router.get('/me', (req, res) => {
  const member = db.prepare('SELECT id, name, email, phone, role, skills, bio FROM crew WHERE id = ?').get(req.crew.id);
  if (!member) return res.status(404).json({ error: 'Not found' });
  res.json(member);
});

// GET /api/portal/projects
router.get('/projects', (req, res) => {
  const projects = db.prepare(`
    SELECT p.id, p.name, p.status, p.start_date, p.end_date, p.is_shoot, p.shoot_location, p.shoot_address, p.description,
           pc.role_on_project, pc.confirmed
    FROM project_crew pc JOIN projects p ON pc.project_id = p.id
    WHERE pc.crew_id = ? ORDER BY p.start_date DESC
  `).all(req.crew.id);
  res.json(projects);
});

// GET /api/portal/projects/:id
router.get('/projects/:id', (req, res) => {
  const assignment = db.prepare('SELECT * FROM project_crew WHERE project_id=? AND crew_id=?').get(req.params.id, req.crew.id);
  if (!assignment) return res.status(403).json({ error: 'Not assigned to this project' });

  const project = db.prepare(`
    SELECT p.id, p.name, p.status, p.description, p.start_date, p.end_date,
           p.is_shoot, p.shoot_location, p.shoot_address,
           c.name as client_name
    FROM projects p LEFT JOIN clients c ON p.client_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });

  // Other crew (names and roles only — no rates)
  const crew = db.prepare(`
    SELECT cr.name, cr.role, pc.role_on_project
    FROM project_crew pc JOIN crew cr ON pc.crew_id = cr.id
    WHERE pc.project_id = ?
  `).all(req.params.id);

  const events = db.prepare(`
    SELECT e.id, e.title, e.start_datetime, e.end_datetime, e.location, e.address, e.parking_notes, e.call_time, e.general_notes,
           ec.personal_call_time
    FROM events e LEFT JOIN event_crew ec ON e.id = ec.event_id AND ec.crew_id = ?
    WHERE e.project_id = ? ORDER BY e.start_datetime
  `).all(req.crew.id, req.params.id);

  const deliverables = db.prepare('SELECT id, title, status, due_date FROM project_deliverables WHERE project_id = ?').all(req.params.id);

  res.json({ ...project, myRole: assignment.role_on_project, confirmed: assignment.confirmed, crew, events, deliverables });
});

// GET /api/portal/schedule
router.get('/schedule', (req, res) => {
  const events = db.prepare(`
    SELECT e.*, ec.personal_call_time, p.name as project_name
    FROM event_crew ec
    JOIN events e ON ec.event_id = e.id
    LEFT JOIN projects p ON e.project_id = p.id
    WHERE ec.crew_id = ? AND e.start_datetime >= datetime('now')
    ORDER BY e.start_datetime
  `).all(req.crew.id);
  res.json(events);
});

// PUT /api/portal/projects/:id/confirm
router.put('/projects/:id/confirm', (req, res) => {
  const { confirmed } = req.body; // true or false
  db.prepare('UPDATE project_crew SET confirmed=? WHERE project_id=? AND crew_id=?').run(confirmed ? 1 : 0, req.params.id, req.crew.id);
  res.json({ ok: true });
});

// Availability
router.get('/availability', (req, res) => {
  res.json(db.prepare('SELECT * FROM crew_unavailability WHERE crew_id = ? ORDER BY date').all(req.crew.id));
});

router.post('/availability', (req, res) => {
  const { date, note } = req.body;
  if (!date) return res.status(400).json({ error: 'Date required' });
  const result = db.prepare('INSERT INTO crew_unavailability (crew_id, date, note) VALUES (?, ?, ?)').run(req.crew.id, date, note);
  res.status(201).json(db.prepare('SELECT * FROM crew_unavailability WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/availability/:id', (req, res) => {
  db.prepare('DELETE FROM crew_unavailability WHERE id=? AND crew_id=?').run(req.params.id, req.crew.id);
  res.json({ ok: true });
});

module.exports = router;
