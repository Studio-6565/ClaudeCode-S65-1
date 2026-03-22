const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { sendInvoiceEmail } = require('../services/email');

router.use(requireAdmin);

router.get('/', (req, res) => {
  const { status, client_id, project_id } = req.query;
  let q = `SELECT i.*, c.name as client_name, p.name as project_name FROM invoices i LEFT JOIN clients c ON i.client_id = c.id LEFT JOIN projects p ON i.project_id = p.id WHERE 1=1`;
  const params = [];
  if (status) { q += ' AND i.status = ?'; params.push(status); }
  if (client_id) { q += ' AND i.client_id = ?'; params.push(client_id); }
  if (project_id) { q += ' AND i.project_id = ?'; params.push(project_id); }
  q += ' ORDER BY i.created_at DESC';
  res.json(db.prepare(q).all(...params));
});

router.get('/:id', (req, res) => {
  const invoice = db.prepare(`
    SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
    FROM invoices i LEFT JOIN clients c ON i.client_id = c.id LEFT JOIN projects p ON i.project_id = p.id
    WHERE i.id = ?
  `).get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  const payments = db.prepare('SELECT * FROM invoice_payments WHERE invoice_id = ? ORDER BY paid_date').all(req.params.id);
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  res.json({ ...invoice, payments, paid, balance: invoice.amount - paid });
});

router.post('/', (req, res) => {
  const { project_id, client_id, invoice_number, amount, status, issued_date, due_date, notes } = req.body;
  const result = db.prepare(`INSERT INTO invoices (project_id, client_id, invoice_number, amount, status, issued_date, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(project_id, client_id, invoice_number, amount || 0, status || 'Draft', issued_date, due_date, notes);
  res.status(201).json(db.prepare('SELECT * FROM invoices WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { project_id, client_id, invoice_number, amount, status, issued_date, due_date, paid_date, notes } = req.body;
  const existing = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(`UPDATE invoices SET project_id=?, client_id=?, invoice_number=?, amount=?, status=?, issued_date=?, due_date=?, paid_date=?, notes=? WHERE id=?`).run(project_id, client_id, invoice_number, amount || 0, status, issued_date, due_date, paid_date, notes, req.params.id);

  // Send email if status changed to 'Sent'
  if (status === 'Sent' && existing.status !== 'Sent') {
    const updated = db.prepare('SELECT i.*, c.name, c.email FROM invoices i LEFT JOIN clients c ON i.client_id = c.id WHERE i.id = ?').get(req.params.id);
    const project = updated.project_id ? db.prepare('SELECT name FROM projects WHERE id = ?').get(updated.project_id) : null;
    if (updated.email) {
      sendInvoiceEmail({ client: { name: updated.name, email: updated.email }, invoice: updated, project }).catch(e => console.error('Email error:', e));
    }
  }

  res.json(db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Payments
router.post('/:id/payments', (req, res) => {
  const { amount, paid_date, method, notes } = req.body;
  if (!amount || !paid_date) return res.status(400).json({ error: 'Amount and paid_date required' });
  const result = db.prepare('INSERT INTO invoice_payments (invoice_id, amount, paid_date, method, notes) VALUES (?, ?, ?, ?, ?)').run(req.params.id, amount, paid_date, method, notes);

  // Auto-update invoice status
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  const totalPaid = db.prepare('SELECT SUM(amount) as s FROM invoice_payments WHERE invoice_id = ?').get(req.params.id).s || 0;
  let newStatus = invoice.status;
  if (totalPaid >= invoice.amount) newStatus = 'Paid';
  else if (totalPaid > 0) newStatus = 'Partial';
  if (newStatus !== invoice.status) {
    db.prepare('UPDATE invoices SET status=?, paid_date=? WHERE id=?').run(newStatus, newStatus === 'Paid' ? paid_date : null, req.params.id);
  }

  res.status(201).json(db.prepare('SELECT * FROM invoice_payments WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/:id/payments/:pid', (req, res) => {
  db.prepare('DELETE FROM invoice_payments WHERE id=? AND invoice_id=?').run(req.params.pid, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
