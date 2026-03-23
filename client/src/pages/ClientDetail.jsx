import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../api';
import Badge from '../components/Badge';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    adminApi.get(`/clients/${id}`).then(r => setClient(r.data)).catch(console.error);
  }, [id]);

  if (!client) return <div className="text-slate-400 text-sm">Loading…</div>;

  const totalRevenue = client.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/clients" className="text-sm text-slate-400 hover:text-slate-600">Clients</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600">{client.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">{client.name}</h1>
        {client.company && <p className="text-slate-500 mt-1">{client.company}</p>}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
          {client.email && <a href={`mailto:${client.email}`} className="text-red-600 hover:underline">{client.email}</a>}
          {client.phone && <span>{client.phone}</span>}
          {client.tags && <span className="text-slate-400">{client.tags}</span>}
        </div>
        {client.notes && <p className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{client.notes}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-800 p-5 border-b border-slate-100">Projects ({client.projects.length})</h2>
          <div className="divide-y divide-slate-100">
            {client.projects.length === 0 && <p className="p-5 text-sm text-slate-400">No projects</p>}
            {client.projects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.start_date || 'No date'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.budget_revenue > 0 && <span className="text-sm text-slate-500">${p.budget_revenue.toLocaleString()}</span>}
                  <Badge label={p.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Invoices</h2>
            <span className="text-xs text-green-600 font-medium">${totalRevenue.toLocaleString()} received</span>
          </div>
          <div className="divide-y divide-slate-100">
            {client.invoices.length === 0 && <p className="p-5 text-sm text-slate-400">No invoices</p>}
            {client.invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{inv.invoice_number || `INV-${inv.id}`}</p>
                  <p className="text-xs text-slate-400">{inv.due_date ? `Due ${inv.due_date}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={inv.status} />
                  <span className="text-sm font-medium text-slate-700">${inv.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
