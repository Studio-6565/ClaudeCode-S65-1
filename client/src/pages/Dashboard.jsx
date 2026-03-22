import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import Badge from '../components/Badge';

function StatCard({ label, value, sub, color = 'indigo' }) {
  const colors = { indigo: 'bg-indigo-50 text-indigo-600', green: 'bg-green-50 text-green-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600' };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color].split(' ')[1]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const [projects, invoices, events, clients] = await Promise.all([
        adminApi.get('/projects'),
        adminApi.get('/invoices'),
        adminApi.get('/events', { params: { month: new Date().toISOString().slice(0, 7) } }),
        adminApi.get('/clients'),
      ]);
      setData({ projects: projects.data, invoices: invoices.data, events: events.data, clients: clients.data });
    }
    load().catch(console.error);
  }, []);

  if (!data) return <div className="text-slate-400 text-sm">Loading…</div>;

  const activeProjects = data.projects.filter(p => ['Active', 'Pre-Production', 'Post-Production'].includes(p.status));
  const outstandingInvoices = data.invoices.filter(i => ['Sent', 'Partial', 'Overdue'].includes(i.status));
  const outstandingAmount = outstandingInvoices.reduce((s, i) => s + i.amount, 0);
  const totalRevenue = data.projects.reduce((s, p) => s + (p.financials?.revenue || 0), 0);
  const recentProjects = data.projects.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clients" value={data.clients.length} color="indigo" />
        <StatCard label="Active Projects" value={activeProjects.length} color="green" />
        <StatCard label="Outstanding Invoices" value={outstandingInvoices.length} sub={`$${outstandingAmount.toLocaleString()}`} color="amber" />
        <StatCard label="Events This Month" value={data.events.length} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Projects</h2>
            <Link to="/projects" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProjects.length === 0 && <p className="p-5 text-sm text-slate-400">No projects yet</p>}
            {recentProjects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.client_name || 'No client'}</p>
                </div>
                <Badge label={p.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Events This Month</h2>
            <Link to="/schedule" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.events.length === 0 && <p className="p-5 text-sm text-slate-400">No events this month</p>}
            {data.events.slice(0, 5).map(ev => (
              <div key={ev.id} className="p-4">
                <p className="text-sm font-medium text-slate-800">{ev.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(ev.start_datetime).toLocaleDateString()} {ev.location ? `• ${ev.location}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Outstanding Invoices</h2>
            <Link to="/invoices" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {outstandingInvoices.length === 0 && <p className="p-5 text-sm text-slate-400">No outstanding invoices</p>}
            {outstandingInvoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{inv.invoice_number || `INV-${inv.id}`}</p>
                  <p className="text-xs text-slate-400">{inv.client_name} {inv.due_date ? `• Due ${inv.due_date}` : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge label={inv.status} />
                  <span className="text-sm font-semibold text-slate-700">${inv.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
