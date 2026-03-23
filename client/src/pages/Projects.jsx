import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';

const STATUSES = ['Lead', 'Pre-Production', 'Active', 'Post-Production', 'Completed', 'Archived'];
const FILTERS = ['All', 'Lead', 'Pre-Production', 'Active', 'Post-Production', 'Completed'];
const EMPTY = { name: '', client_id: '', status: 'Lead', description: '', start_date: '', end_date: '', is_shoot: false, shoot_location: '', shoot_address: '', budget_revenue: '', budget_cost: '', rental_cost: '', notes: '' };
const inp = { backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '100%' };
const btnPrimary = { backgroundColor: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };

function StatusBadge({ status }) {
  const colors = { Lead: '#3b82f6', 'Pre-Production': '#8b5cf6', Active: '#22c55e', 'Post-Production': '#f59e0b', Completed: '#6b7280', Archived: '#374151' };
  const c = colors[status] || '#555';
  return <span style={{ backgroundColor: c + '22', color: c, border: `1px solid ${c}44`, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{status}</span>;
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '16px 20px' }}>
      <p style={{ fontSize: '10px', color: '#555', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: 800, color: color || '#fff', margin: 0 }}>{value}</p>
    </div>
  );
}

function ProjectCard({ p, onEdit, onDelete }) {
  const f = p.financials || {};
  const net = (f.revenue || 0) - (f.totalCost || 0);
  const mc = f.margin >= 60 ? '#22c55e' : f.margin >= 30 ? '#f59e0b' : '#ED1C24';
  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '11px', color: '#555' }}>{p.start_date || '—'}{p.end_date ? ` · ${p.end_date}` : ''}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => onEdit(p)} style={{ fontSize: '11px', color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
          <button onClick={() => onDelete(p.id)} style={{ fontSize: '11px', color: '#ED1C24', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>✕</button>
        </div>
      </div>
      <Link to={`/projects/${p.id}`} style={{ fontSize: '17px', fontWeight: 700, color: '#fff', textDecoration: 'none', lineHeight: 1.2 }}>{p.name}</Link>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {p.client_name && <span style={{ backgroundColor: '#2a2a2a', color: '#aaa', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>{p.client_name}</span>}
        {f.margin > 0 && <span style={{ backgroundColor: mc + '22', color: mc, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{Math.round(f.margin)}% margin</span>}
        <StatusBadge status={p.status} />
      </div>
      {p.shoot_address && <div style={{ fontSize: '12px', color: '#666' }}>📍 {p.shoot_address}</div>}
      {f.revenue > 0 && (
        <div style={{ borderTop: '1px solid #222', paddingTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {[['Revenue', `$${(f.revenue||0).toLocaleString()}`, '#fff'], ['Crew', `$${(f.crewCost||0).toLocaleString()}`, '#aaa'], ['Rental', `$${(f.rentalCost||0).toLocaleString()}`, '#aaa'], ['Net', `$${net.toLocaleString()}`, net >= 0 ? '#22c55e' : '#ED1C24']].map(([l, v, c]) => (
            <div key={l}>
              <p style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px', fontWeight: 700 }}>{l}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: c, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#555' }}>
        <span>Deliverables — 0/{p.deliverable_count || 0} done</span>
        {f.crewCost > 0 && <span style={{ color: '#ED1C24' }}>Crew owed ${(f.crewCost||0).toLocaleString()}</span>}
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [filter, search]);
  useEffect(() => { adminApi.get('/clients').then(r => setClients(r.data)); }, []);

  async function load() {
    const res = await adminApi.get('/projects', { params: { status: filter === 'All' ? undefined : filter, search: search || undefined } });
    setProjects(res.data);
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(p) { setForm({ ...p, client_id: p.client_id || '', is_shoot: !!p.is_shoot }); setError(''); setModal(p); }

  async function save(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const pl = { ...form, budget_revenue: parseFloat(form.budget_revenue)||0, budget_cost: parseFloat(form.budget_cost)||0, rental_cost: parseFloat(form.rental_cost)||0 };
      if (modal === 'add') await adminApi.post('/projects', pl); else await adminApi.put(`/projects/${modal.id}`, pl);
      setModal(null); load();
    } catch (err) { setError(err.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  }

  async function del(id) { if (!confirm('Delete?')) return; await adminApi.delete(`/projects/${id}`); load(); }

  const totalRevenue = projects.reduce((s, p) => s + (p.financials?.revenue||0), 0);
  const totalNet = projects.reduce((s, p) => s + ((p.financials?.revenue||0) - (p.financials?.totalCost||0)), 0);
  const crewOwed = projects.reduce((s, p) => s + (p.financials?.crewCost||0), 0);
  const withMargin = projects.filter(p => p.financials?.revenue > 0);
  const avgMargin = withMargin.length ? withMargin.reduce((s, p) => s + (p.financials?.margin||0), 0) / withMargin.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#fff" />
        <StatCard label="Total Net" value={`$${totalNet.toLocaleString()}`} color="#22c55e" />
        <StatCard label="Avg Margin" value={`${Math.round(avgMargin)}%`} color="#3b82f6" />
        <StatCard label="Projects" value={`${projects.length}`} color="#f59e0b" />
        <StatCard label="Crew Owed" value={`$${crewOwed.toLocaleString()}`} color="#ED1C24" />
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: '180px', width: 'auto' }} />
        <button onClick={openAdd} style={btnPrimary}>+ New Project</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: filter === f ? '1px solid #ED1C24' : '1px solid #2a2a2a', backgroundColor: filter === f ? '#ED1C24' : '#1a1a1a', color: filter === f ? '#fff' : '#888' }}>
            {f}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#444' }}>
          <p>No projects yet</p>
          <button onClick={openAdd} style={{ ...btnPrimary, marginTop: '12px' }}>+ New Project</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {projects.map(p => <ProjectCard key={p.id} p={p} onEdit={openEdit} onDelete={del} />)}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[['Project Name *', 'name', 'text', true], ['Description', 'description', 'text', false]].slice(0,1).map(([l, k, t, r]) => (
              <div key={k}><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>{l}</label><input style={inp} type={t} value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} required={r} /></div>
            ))}
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Client</label>
              <select style={inp} value={form.client_id} onChange={e => setForm(p => ({...p, client_id: e.target.value}))}>
                <option value="">No client</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Status</label>
              <select style={inp} value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Start Date</label><input style={inp} type="date" value={form.start_date} onChange={e => setForm(p => ({...p, start_date: e.target.value}))} /></div>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>End Date</label><input style={inp} type="date" value={form.end_date} onChange={e => setForm(p => ({...p, end_date: e.target.value}))} /></div>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'14px', color:'#ccc' }}>
              <input type="checkbox" checked={form.is_shoot} onChange={e => setForm(p => ({...p, is_shoot: e.target.checked}))} /> This is a shoot
            </label>
            {form.is_shoot && <>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Venue</label><input style={inp} type="text" value={form.shoot_location} onChange={e => setForm(p => ({...p, shoot_location: e.target.value}))} /></div>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Address</label><input style={inp} type="text" value={form.shoot_address} onChange={e => setForm(p => ({...p, shoot_address: e.target.value}))} /></div>
            </>}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
              {[['Revenue ($)', 'budget_revenue'], ['Rental ($)', 'rental_cost'], ['Other Cost ($)', 'budget_cost']].map(([l, k]) => (
                <div key={k}><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>{l}</label><input style={inp} type="number" min="0" step="0.01" value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} /></div>
              ))}
            </div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Notes</label><textarea style={{ ...inp, resize:'vertical' }} rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} /></div>
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
