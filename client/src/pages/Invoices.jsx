import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import Modal from '../components/Modal';

const STATUSES = ['Draft', 'Sent', 'Partial', 'Paid', 'Overdue'];
const EMPTY_INV = { project_id: '', client_id: '', invoice_number: '', amount: '', status: 'Draft', issued_date: '', due_date: '', notes: '' };
const EMPTY_PAY = { amount: '', paid_date: '', method: '', notes: '' };
const inp = { backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '100%' };
const btnPrimary = { backgroundColor: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };

function statusColor(s) {
  return { Draft: '#6b7280', Sent: '#3b82f6', Partial: '#f59e0b', Paid: '#22c55e', Overdue: '#ED1C24' }[s] || '#555';
}

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
  async function loadDetail(id) { const res = await adminApi.get(`/invoices/${id}`); setDetail(res.data); }
  function openAdd() { setForm(EMPTY_INV); setModal('add'); }
  function openEdit(inv) { setForm({ ...inv, project_id: inv.project_id || '', client_id: inv.client_id || '' }); setModal(inv); }
  async function save(e) {
    e.preventDefault(); setSaving(true);
    try {
      const pl = { ...form, amount: parseFloat(form.amount) || 0 };
      if (modal === 'add') await adminApi.post('/invoices', pl); else await adminApi.put(`/invoices/${modal.id}`, pl);
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(id) { if (!confirm('Delete?')) return; await adminApi.delete(`/invoices/${id}`); setDetail(null); load(); }
  async function addPayment(e) {
    e.preventDefault();
    await adminApi.post(`/invoices/${detail.id}/payments`, { ...payForm, amount: parseFloat(payForm.amount) });
    setPayForm(EMPTY_PAY); loadDetail(detail.id); load();
  }

  // Group by month
  const grouped = invoices.reduce((acc, inv) => {
    const key = inv.issued_date ? inv.issued_date.slice(0, 7) : 'Undated';
    if (!acc[key]) acc[key] = [];
    acc[key].push(inv);
    return acc;
  }, {});

  const totalOutstanding = invoices.filter(i => ['Sent', 'Partial', 'Overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0);
  const card = { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Invoices</h1>
          {totalOutstanding > 0 && <p style={{ fontSize: '13px', color: '#ED1C24', margin: 0 }}>${totalOutstanding.toLocaleString()} outstanding</p>}
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ New Invoice</button>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: filter === s ? '1px solid #ED1C24' : '1px solid #2a2a2a', backgroundColor: filter === s ? '#ED1C24' : '#1a1a1a', color: filter === s ? '#fff' : '#888' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Timeline grouped list */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
          <p>No invoices yet</p>
          <button onClick={openAdd} style={{ ...btnPrimary, marginTop: '12px' }}>+ New Invoice</button>
        </div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([month, items]) => (
          <div key={month}>
            <p style={{ fontSize: '11px', color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              {month === 'Undated' ? 'Undated' : new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(inv => {
                const sc = statusColor(inv.status);
                return (
                  <div key={inv.id} style={{ ...card, cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
                    onClick={() => loadDetail(inv.id)}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sc, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{inv.project_name || inv.invoice_number || `INV-${inv.id}`}</span>
                        {inv.issued_date && <span style={{ fontSize: '12px', color: '#555' }}>{inv.issued_date}</span>}
                        {inv.client_name && <span style={{ fontSize: '12px', backgroundColor: '#2a2a2a', color: '#888', borderRadius: '6px', padding: '2px 8px' }}>{inv.client_name}</span>}
                        <span style={{ fontSize: '11px', backgroundColor: sc + '22', color: sc, border: `1px solid ${sc}44`, borderRadius: '6px', padding: '2px 8px', fontWeight: 600 }}>{inv.status}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                        {inv.due_date ? `Due ${inv.due_date}` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: inv.status === 'Paid' ? '#22c55e' : '#fff', margin: '0 0 2px' }}>${inv.amount.toLocaleString()}</p>
                      {['Sent', 'Partial', 'Overdue'].includes(inv.status) && (
                        <p style={{ fontSize: '11px', color: '#ED1C24', margin: 0 }}>Unpaid</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEdit(inv)} style={{ fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => del(inv.id)} style={{ fontSize: '12px', color: '#ED1C24', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Invoice detail panel */}
      {detail && (
        <div style={{ ...card, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{detail.invoice_number || `INV-${detail.id}`}</h2>
              <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{detail.client_name}{detail.project_name ? ` · ${detail.project_name}` : ''}</p>
            </div>
            <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[['Amount', `$${detail.amount.toLocaleString()}`, '#fff'], ['Paid', `$${(detail.paid||0).toLocaleString()}`, '#22c55e'], ['Balance', `$${(detail.balance||0).toLocaleString()}`, detail.balance > 0 ? '#ED1C24' : '#555']].map(([l, v, c]) => (
              <div key={l}>
                <p style={{ fontSize: '11px', color: '#555', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{l}</p>
                <p style={{ fontSize: '22px', fontWeight: 800, color: c, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
          {detail.payments?.length > 0 && detail.payments.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222', fontSize: '13px' }}>
              <span style={{ color: '#888' }}>{p.paid_date}{p.method ? ` · ${p.method}` : ''}</span>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>${p.amount.toLocaleString()}</span>
            </div>
          ))}
          {detail.balance > 0 && (
            <form onSubmit={addPayment} style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <input type="number" min="0.01" step="0.01" placeholder="Amount" value={payForm.amount} onChange={e => setPayForm(p => ({...p, amount: e.target.value}))} required style={{ ...inp, width: '120px' }} />
              <input type="date" value={payForm.paid_date} onChange={e => setPayForm(p => ({...p, paid_date: e.target.value}))} required style={{ ...inp, width: 'auto' }} />
              <input type="text" placeholder="Method" value={payForm.method} onChange={e => setPayForm(p => ({...p, method: e.target.value}))} style={{ ...inp, flex: 1 }} />
              <button type="submit" style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Log Payment</button>
            </form>
          )}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Invoice' : 'Edit Invoice'} onClose={() => setModal(null)}>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Invoice #</label><input style={inp} type="text" value={form.invoice_number} onChange={e => setForm(p => ({...p, invoice_number: e.target.value}))} placeholder="INV-001" /></div>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Amount ($) *</label><input style={inp} type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} required /></div>
            </div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Client</label>
              <select style={inp} value={form.client_id} onChange={e => setForm(p => ({...p, client_id: e.target.value}))}>
                <option value="">No client</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Project</label>
              <select style={inp} value={form.project_id} onChange={e => setForm(p => ({...p, project_id: e.target.value}))}>
                <option value="">No project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Status</label>
              <select style={inp} value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Issued Date</label><input style={inp} type="date" value={form.issued_date} onChange={e => setForm(p => ({...p, issued_date: e.target.value}))} /></div>
              <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Due Date</label><input style={inp} type="date" value={form.due_date} onChange={e => setForm(p => ({...p, due_date: e.target.value}))} /></div>
            </div>
            <div><label style={{ display:'block', fontSize:'12px', color:'#888', marginBottom:'6px', fontWeight:600 }}>Notes</label><textarea style={{ ...inp, resize:'vertical' }} rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} /></div>
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
