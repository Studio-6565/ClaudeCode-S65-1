import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';

const EMPTY = { name: '', email: '', phone: '', role: '', skills: '', bio: '', portal_code: '' };
const inp = { backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '100%' };
const btnPrimary = { backgroundColor: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
function avatarColor(name) {
  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'];
  let h = 0; for (let c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length; return colors[h];
}

export default function Crew() {
  const [crew, setCrew] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [search]);
  async function load() { const res = await adminApi.get('/crew', { params: { search } }); setCrew(res.data); }
  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(m) { setForm({ ...m, portal_code: m.portal_code || '' }); setError(''); setModal(m); }
  async function save(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (modal === 'add') await adminApi.post('/crew', form); else await adminApi.put(`/crew/${modal.id}`, form);
      setModal(null); load();
    } catch (err) { setError(err.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  }
  async function del(id) { if (!confirm('Delete crew member?')) return; await adminApi.delete(`/crew/${id}`); load(); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Search crew…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: '200px', width: 'auto' }} />
        <button onClick={openAdd} style={btnPrimary}>+ Add Crew</button>
      </div>

      {crew.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
          <p>No crew members yet</p>
          <button onClick={openAdd} style={{ ...btnPrimary, marginTop: '12px' }}>+ Add Crew</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {crew.map(m => {
            const color = avatarColor(m.name);
            return (
              <div key={m.id} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '33', border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color, flexShrink: 0 }}>
                    {initials(m.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link to={`/crew/${m.id}`} style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textDecoration: 'none' }}>{m.name}</Link>
                    {m.role && <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0' }}>{m.role}</p>}
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: '#2a2a2a', color: '#888', borderRadius: '6px', padding: '3px 8px', flexShrink: 0 }}>Crew</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {m.phone && <div style={{ fontSize: '13px', color: '#888' }}>📱 {m.phone}</div>}
                  {m.email && <div style={{ fontSize: '13px', color: '#888' }}>✉ {m.email}</div>}
                  {m.portal_code && <div style={{ fontSize: '12px', color: '#22c55e' }}>🔑 Code: <span style={{ fontFamily: 'monospace' }}>{m.portal_code}</span></div>}
                  {m.skills && <div style={{ fontSize: '12px', color: '#666' }}>{m.skills}</div>}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #222', paddingTop: '12px' }}>
                  {m.phone && <a href={`https://wa.me/${m.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#1a3a2a', border: '1px solid #1a5a3a', color: '#22c55e', borderRadius: '8px', padding: '7px', fontSize: '12px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>WhatsApp</a>}
                  {m.email && <a href={`mailto:${m.email}`} style={{ flex: 1, background: '#2a2a3a', border: '1px solid #3a3a5a', color: '#888', borderRadius: '8px', padding: '7px', fontSize: '12px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>Email</a>}
                  <button onClick={() => openEdit(m)} style={{ flex: 1, background: '#2a2a2a', border: 'none', color: '#ccc', borderRadius: '8px', padding: '7px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                  <button onClick={() => del(m.id)} style={{ background: 'none', border: '1px solid #333', color: '#666', borderRadius: '8px', padding: '7px 10px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Crew Member' : 'Edit Crew Member'} onClose={() => setModal(null)}>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[['Name *', 'name', 'text', true], ['Role', 'role', 'text', false], ['Email', 'email', 'email', false], ['Phone', 'phone', 'text', false], ['Portal Code', 'portal_code', 'text', false], ['Skills', 'skills', 'text', false]].map(([l, k, t, r]) => (
              <div key={k}><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>{l}</label>
                <input style={inp} type={t} value={form[k]||''} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} required={r} /></div>
            ))}
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Bio</label>
              <textarea style={{ ...inp, resize:'vertical' }} rows={3} value={form.bio||''} onChange={e => setForm(p => ({...p, bio: e.target.value}))} /></div>
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
