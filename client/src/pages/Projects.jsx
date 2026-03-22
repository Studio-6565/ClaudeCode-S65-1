import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

const STATUSES = ['Lead', 'Pre-Production', 'Active', 'Post-Production', 'Completed', 'Archived'];
const EMPTY = { name: '', client_id: '', status: 'Lead', description: '', start_date: '', end_date: '', is_shoot: false, shoot_location: '', shoot_address: '', budget_revenue: '', budget_cost: '', rental_cost: '', notes: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [filter, search]);
  useEffect(() => { adminApi.get('/clients').then(r => setClients(r.data)); }, []);

  async function load() {
    const res = await adminApi.get('/projects', { params: { status: filter || undefined, search: search || undefined } });
    setProjects(res.data);
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(p) { setForm({ ...p, client_id: p.client_id || '', is_shoot: !!p.is_shoot }); setError(''); setModal(p); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, budget_revenue: parseFloat(form.budget_revenue) || 0, budget_cost: parseFloat(form.budget_cost) || 0, rental_cost: parseFloat(form.rental_cost) || 0 };
      if (modal === 'add') await adminApi.post('/projects', payload);
      else await adminApi.put(`/projects/${modal.id}`, payload);
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this project?')) return;
    await adminApi.delete(`/projects/${id}`);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + New Project
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Project', 'Client', 'Dates', 'Revenue', 'Cost', 'Margin', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No projects yet</td></tr>
            )}
            {projects.map(p => {
              const f = p.financials || {};
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/projects/${p.id}`} className="font-medium text-indigo-600 hover:underline">{p.name}</Link>
                    {p.is_shoot ? <span className="ml-1 text-xs text-amber-600">📍 Shoot</span> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.client_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.start_date || '—'}{p.end_date ? ` → ${p.end_date}` : ''}</td>
                  <td className="px-4 py-3 text-slate-700">{f.revenue > 0 ? `$${f.revenue.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{f.totalCost > 0 ? `$${f.totalCost.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    {f.revenue > 0 ? (
                      <span className={f.margin >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                        {f.margin?.toFixed(1)}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3"><Badge label={p.status} /></td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-xs text-slate-500 hover:text-indigo-600">Edit</button>
                    <button onClick={() => del(p.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.is_shoot} onChange={e => setForm(p => ({ ...p, is_shoot: e.target.checked }))} className="rounded" />
              This is a shoot
            </label>
            {form.is_shoot && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Shoot Location</label>
                  <input type="text" value={form.shoot_location} onChange={e => setForm(p => ({ ...p, shoot_location: e.target.value }))} placeholder="Venue name" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                  <input type="text" value={form.shoot_address} onChange={e => setForm(p => ({ ...p, shoot_address: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Revenue ($)', key: 'budget_revenue' },
                { label: 'Rental Cost ($)', key: 'rental_cost' },
                { label: 'Other Cost ($)', key: 'budget_cost' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                  <input type="number" min="0" step="0.01" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
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
