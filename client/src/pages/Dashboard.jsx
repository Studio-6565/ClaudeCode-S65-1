import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: '10px', color: '#555', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 800, color, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

function StatusDot({ status }) {
  const colors = { Lead: '#3b82f6', 'Pre-Production': '#8b5cf6', Active: '#22c55e', 'Post-Production': '#f59e0b', Completed: '#6b7280' };
  return <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors[status] || '#555', marginRight: '8px', flexShrink: 0 }} />;
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const [projects, invoices, events, clients] = await Promise.all([
        adminApi.get('/projects'), adminApi.get('/invoices'),
        adminApi.get('/events', { params: { month: new Date().toISOString().slice(0, 7) } }),
        adminApi.get('/clients'),
      ]);
      setData({ projects: projects.data, invoices: invoices.data, events: events.data, clients: clients.data });
    }
    load().catch(console.error);
  }, []);

  if (!data) return <div style={{ color: '#555', padding: '40px', textAlign: 'center' }}>Loading…</div>;

  const activeProjects = data.projects.filter(p => ['Active', 'Pre-Production', 'Post-Production'].includes(p.status));
  const outstanding = data.invoices.filter(i => ['Sent', 'Partial', 'Overdue'].includes(i.status));
  const outstandingAmt = outstanding.reduce((s, i) => s + i.amount, 0);
  const totalRevenue = data.projects.reduce((s, p) => s + (p.financials?.revenue || 0), 0);
  const totalNet = data.projects.reduce((s, p) => s + ((p.financials?.revenue||0) - (p.financials?.totalCost||0)), 0);

  const card = { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#fff" />
        <StatCard label="Total Net" value={`$${totalNet.toLocaleString()}`} color="#22c55e" />
        <StatCard label="Clients" value={data.clients.length} color="#3b82f6" />
        <StatCard label="Active Projects" value={activeProjects.length} color="#f59e0b" />
        <StatCard label="Outstanding" value={`$${outstandingAmt.toLocaleString()}`} color="#ED1C24" sub={`${outstanding.length} invoices`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Recent Projects */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #222' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Recent Projects</h2>
            <Link to="/projects" style={{ fontSize: '12px', color: '#ED1C24', textDecoration: 'none' }}>View all</Link>
          </div>
          <div>
            {data.projects.length === 0 && <p style={{ padding: '20px', color: '#444', fontSize: '13px' }}>No projects yet</p>}
            {data.projects.slice(0, 5).map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #1a1a1a', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <StatusDot status={p.status} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                    <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{p.client_name || 'No client'}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#888', flexShrink: 0, marginLeft: '8px' }}>{p.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Events */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #222' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Events This Month</h2>
            <Link to="/schedule" style={{ fontSize: '12px', color: '#ED1C24', textDecoration: 'none' }}>View all</Link>
          </div>
          <div>
            {data.events.length === 0 && <p style={{ padding: '20px', color: '#444', fontSize: '13px' }}>No events this month</p>}
            {data.events.slice(0, 5).map(ev => (
              <div key={ev.id} style={{ padding: '12px 20px', borderBottom: '1px solid #1a1a1a' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{ev.title}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>
                  {new Date(ev.start_datetime).toLocaleDateString()}{ev.location ? ` · ${ev.location}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div style={{ ...card, gridColumn: 'span 2' }} className="lg:col-span-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #222' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Outstanding Invoices</h2>
            <Link to="/invoices" style={{ fontSize: '12px', color: '#ED1C24', textDecoration: 'none' }}>View all</Link>
          </div>
          <div>
            {outstanding.length === 0 && <p style={{ padding: '20px', color: '#444', fontSize: '13px' }}>No outstanding invoices</p>}
            {outstanding.slice(0, 5).map(inv => (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #1a1a1a' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{inv.invoice_number || `INV-${inv.id}`}</p>
                  <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{inv.client_name}{inv.due_date ? ` · Due ${inv.due_date}` : ''}</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#ED1C24', margin: 0 }}>${inv.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
