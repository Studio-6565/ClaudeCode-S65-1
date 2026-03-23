import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';

const EMPTY = { name: '', email: '', phone: '', company: '', notes: '', tags: '' };
const inp = { backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '100%' };
const btnPrimary = { backgroundColor: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];
  let h = 0; for (let c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [search]);

  async function load() {
    const res = await adminApi.get('/clients', { params: { search } });
    setClients(res.data);
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(c) { setForm({ ...c }); setError(''); setModal(c); }

  async function save(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (modal === 'add') await adminApi.post('/clients', form); else await adminApi.put(`/clients/${modal.id}`, form);
      setModal(null); load();
    } catch (err) { setError(err.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  }

  async function del(id) { if (!confirm('Delete this client?')) return; await adminApi.delete(`/clients/${id}`); load(); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: '200px', width: 'auto' }} />
        <button onClick={openAdd} style={btnPrimary}>+ Add</button>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
          <p>No clients yet</p>
          <button onClick={openAdd} style={{ ...btnPrimary, marginTop: '12px' }}>+ Add Client</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {clients.map(c => {
            const color = avatarColor(c.name);
            return (
              <div key={c.id} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '33', border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color, flexShrink: 0 }}>
                    {initials(c.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/clients/${c.id}`} style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '2px' }}>{c.name}</Link>
                    {c.company && <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{c.company}</p>}
                  </div>
                  {c.tags && <span style={{ fontSize: '10px', backgroundColor: '#2a2a2a', color: '#888', borderRadius: '6px', padding: '3px 8px', flexShrink: 0 }}>{c.tags}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {c.phone && <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#555' }}>📱</span> {c.phone}
                  </div>}
                  {c.email && <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#555' }}>✉</span> {c.email}
                  </div>}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #222', paddingTop: '12px' }}>
                  <button onClick={() => openEdit(c)} style={{ flex: 1, background: '#2a2a2a', border: 'none', color: '#ccc', borderRadius: '8px', padding: '7px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                  <button onClick={() => del(c.id)} style={{ background: 'none', border: '1px solid #333', color: '#666', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Client' : 'Edit Client'} onClose={() => setModal(null)}>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[['Name *', 'name', 'text', true], ['Email', 'email', 'email', false], ['Phone', 'phone', 'text', false], ['Company', 'company', 'text', false], ['Tags', 'tags', 'text', false]].map(([l, k, t, r]) => (
              <div key={k}><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>{l}</label>
                <input style={inp} type={t} value={form[k]||''} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} required={r} /></div>
            ))}
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Notes</label>
              <textarea style={{ ...inp, resize:'vertical' }} rows={3} value={form.notes||''} onChange={e => setForm(p => ({...p, notes: e.target.value}))} /></div>
            {error && <p style={{ color:'#ED1C24', fontSize:'13px' }}>{error}</p>}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'8px' }}>
              <button type="button" onClick={() => setModal(null)} style={{ background:'none', border:'1px solid #333', color:'#888', borderRadius:'8px', padding:'8px 16px', fontSize:'14px', cursor:'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
