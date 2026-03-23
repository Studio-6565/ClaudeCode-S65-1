import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';

const EMPTY = { name: '', email: '', phone: '', role: '', skills: '', bio: '', portal_code: '' };

export default function Crew() {
  const [crew, setCrew] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [search]);

  async function load() {
    const res = await adminApi.get('/crew', { params: { search } });
    setCrew(res.data);
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(m) { setForm({ ...m, portal_code: m.portal_code || '' }); setError(''); setModal(m); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modal === 'add') {
        await adminApi.post('/crew', form);
      } else {
        await adminApi.put(`/crew/${modal.id}`, form);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this crew member?')) return;
    await adminApi.delete(`/crew/${id}`);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Crew</h1>
        <button onClick={openAdd} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          + Add Crew
        </button>
      </div>

      <input
        type="search"
        placeholder="Search crew…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name', 'Role', 'Email', 'Phone', 'Portal Code', 'Skills', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {crew.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No crew members yet</td></tr>
            )}
            {crew.map(m => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/crew/${m.id}`} className="font-medium text-red-600 hover:underline">{m.name}</Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{m.role || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{m.email || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{m.phone || '—'}</td>
                <td className="px-4 py-3">
                  {m.portal_code
                    ? <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">{m.portal_code}</code>
                    : <span className="text-xs text-slate-400">Not set</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{m.skills || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(m)} className="text-xs text-slate-500 hover:text-red-600">Edit</button>
                  <button onClick={() => del(m.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Crew Member' : 'Edit Crew Member'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            {[
              { label: 'Name *', key: 'name', required: true },
              { label: 'Role (e.g. Photographer, Editor)', key: 'role' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Portal Code (crew uses this to log in)', key: 'portal_code' },
              { label: 'Skills', key: 'skills' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  required={f.required}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Bio</label>
              <textarea
                value={form.bio || ''}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
