import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

const STATUSES = ['Draft', 'Sent', 'Partial', 'Paid', 'Overdue'];
const EMPTY_INV = { project_id: '', client_id: '', invoice_number: '', amount: '', status: 'Draft', issued_date: '', due_date: '', notes: '' };
const EMPTY_PAY = { amount: '', paid_date: '', method: '', notes: '' };

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_INV);
  const [detail, setDetail] = useState(null);
  const [payForm, setPayForm] = useState(EMPTY_PAY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [filter]);
  useEffect(() => {
    adminApi.get('/clients').then(r => setClients(r.data));
    adminApi.get('/projects').then(r => setProjects(r.data));
  }, []);

  async function load() {
    const res = await adminApi.get('/invoices', { params: { status: filter || undefined } });
    setInvoices(res.data);
  }

  async function loadDetail(id) {
    const res = await adminApi.get(`/invoices/${id}`);
    setDetail(res.data);
  }

  function openAdd() { setForm(EMPTY_INV); setModal('add'); }
  function openEdit(inv) { setForm({ ...inv, project_id: inv.project_id || '', client_id: inv.client_id || '' }); setModal(inv); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) || 0 };
      if (modal === 'add') await adminApi.post('/invoices', payload);
      else await adminApi.put(`/invoices/${modal.id}`, payload);
      setModal(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this invoice?')) return;
    await adminApi.delete(`/invoices/${id}`);
    setDetail(null);
    load();
  }

  async function addPayment(e) {
    e.preventDefault();
    await adminApi.post(`/invoices/${detail.id}/payments`, { ...payForm, amount: parseFloat(payForm.amount) });
    setPayForm(EMPTY_PAY);
    loadDetail(detail.id);
    load();
  }

  const totalOutstanding = invoices.filter(i => ['Sent', 'Partial', 'Overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          {totalOutstanding > 0 && <p className="text-sm text-amber-600 mt-0.5">${totalOutstanding.toLocaleString()} outstanding</p>}
        </div>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + New Invoice
        </button>
      </div>

      <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Invoice #', 'Client', 'Project', 'Amount', 'Issued', 'Due', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No invoices yet</td></tr>}
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => loadDetail(inv.id)}>
                <td className="px-4 py-3 font-medium text-indigo-600">{inv.invoice_number || `INV-${inv.id}`}</td>
                <td className="px-4 py-3 text-slate-600">{inv.client_name || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{inv.project_name || '—'}</td>
                <td className="px-4 py-3 font-medium text-slate-800">${inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500">{inv.issued_date || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{inv.due_date || '—'}</td>
                <td className="px-4 py-3"><Badge label={inv.status} /></td>
                <td className="px-4 py-3 text-right space-x-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(inv)} className="text-xs text-slate-500 hover:text-indigo-600">Edit</button>
                  <button onClick={() => del(inv.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice detail */}
      {detail && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">{detail.invoice_number || `INV-${detail.id}`}</h2>
              <p className="text-sm text-slate-500">{detail.client_name} {detail.project_name ? `• ${detail.project_name}` : ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge label={detail.status} />
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
          </div>

          <div className="mt-4 flex gap-6 text-sm">
            <div><p className="text-xs text-slate-400">Amount</p><p className="text-xl font-bold text-slate-800">${detail.amount.toLocaleString()}</p></div>
            <div><p className="text-xs text-slate-400">Paid</p><p className="text-xl font-bold text-green-600">${(detail.paid || 0).toLocaleString()}</p></div>
            <div><p className="text-xs text-slate-400">Balance</p><p className={`text-xl font-bold ${detail.balance > 0 ? 'text-amber-600' : 'text-slate-400'}`}>${(detail.balance || 0).toLocaleString()}</p></div>
          </div>

          {/* Payments */}
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Payment History</p>
            {detail.payments.length === 0 && <p className="text-xs text-slate-400 mb-3">No payments yet</p>}
            {detail.payments.map(p => (
              <div key={p.id} className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="text-slate-600">{p.paid_date} {p.method ? `• ${p.method}` : ''}</span>
                <span className="font-medium text-green-600">${p.amount.toLocaleString()}</span>
              </div>
            ))}

            {detail.balance > 0 && (
              <form onSubmit={addPayment} className="mt-3 flex gap-2 flex-wrap">
                <input type="number" min="0.01" step="0.01" placeholder="Amount" value={payForm.amount} onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} required className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-28" />
                <input type="date" value={payForm.paid_date} onChange={e => setPayForm(p => ({ ...p, paid_date: e.target.value }))} required className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" placeholder="Method (e.g. Bank transfer)" value={payForm.method} onChange={e => setPayForm(p => ({ ...p, method: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1" />
                <button type="submit" className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Log Payment</button>
              </form>
            )}
          </div>
          {detail.notes && <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded p-2">{detail.notes}</p>}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'New Invoice' : 'Edit Invoice'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Invoice #</label>
                <input type="text" value={form.invoice_number} onChange={e => setForm(p => ({ ...p, invoice_number: e.target.value }))} placeholder="INV-001" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount ($) *</label>
                <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project</label>
              <select value={form.project_id} onChange={e => setForm(p => ({ ...p, project_id: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Issued Date</label>
                <input type="date" value={form.issued_date} onChange={e => setForm(p => ({ ...p, issued_date: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <p className="text-xs text-slate-400">Changing status to "Sent" will automatically email the client.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
