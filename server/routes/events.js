const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { sendEventAssignmentEmail } = require('../services/email');

router.use(requireAdmin);

router.get('/', (req, res) => {
  const { month, project_id } = req.query;
  let q = `SELECT e.*, p.name as project_name FROM events e LEFT JOIN projects p ON e.project_id = p.id WHERE 1=1`;
  const params = [];
  if (month) {
    q += ' AND strftime(\'%Y-%m\', e.start_datetime) = ?';
    params.push(month);
  }
  if (project_id) {
    q += ' AND e.project_id = ?';
    params.push(project_id);
  }
  q += ' ORDER BY e.start_datetime';
  res.json(db.prepare(q).all(...params));
});

router.get('/:id', (req, res) => {
  const event = db.prepare(`
    SELECT e.*, p.name as project_name
    FROM events e LEFT JOIN projects p ON e.project_id = p.id
    WHERE e.id = ?
  `).get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Not found' });
  const crew = db.prepare(`
    SELECT ec.*, cr.name, cr.role, cr.email
    FROM event_crew ec JOIN crew cr ON ec.crew_id = cr.id
    WHERE ec.event_id = ?
  `).all(req.params.id);
  res.json({ ...event, crew });
});

router.post('/', (req, res) => {
  const { title, project_id, start_datetime, end_datetime, location, address, parking_notes, call_time, general_notes } = req.body;
  if (!title || !start_datetime) return res.status(400).json({ error: 'Title and start_datetime required' });
  const result = db.prepare(`INSERT INTO events (title, project_id, start_datetime, end_datetime, location, address, parking_notes, call_time, general_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, project_id, start_datetime, end_datetime, location, address, parking_notes, call_time, general_notes);
  res.status(201).json(db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { title, project_id, start_datetime, end_datetime, location, address, parking_notes, call_time, general_notes } = req.body;
  const existing = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare(`UPDATE events SET title=?, project_id=?, start_datetime=?, end_datetime=?, location=?, address=?, parking_notes=?, call_time=?, general_notes=? WHERE id=?`).run(title, project_id, start_datetime, end_datetime, location, address, parking_notes, call_time, general_notes, req.params.id);
  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Crew on event
router.post('/:id/crew', async (req, res) => {
  const { crew_id, personal_call_time } = req.body;
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const crewMember = db.prepare('SELECT * FROM crew WHERE id = ?').get(crew_id);
  if (!crewMember) return res.status(404).json({ error: 'Crew not found' });

  try {
    db.prepare('INSERT INTO event_crew (event_id, crew_id, personal_call_time) VALUES (?, ?, ?)').run(req.params.id, crew_id, personal_call_time);
  } catch {
    return res.status(409).json({ error: 'Crew already on event' });
  }

  if (crewMember.email) {
    sendEventAssignmentEmail({ crew: crewMember, event: { ...event, call_time: personal_call_time || event.call_time } }).catch(e => console.error('Email error:', e));
  }

  res.status(201).json({ ok: true });
});

router.delete('/:id/crew/:crewId', (req, res) => {
  db.prepare('DELETE FROM event_crew WHERE event_id=? AND crew_id=?').run(req.params.id, req.params.crewId);
  res.json({ ok: true });
});

module.exports = router;
