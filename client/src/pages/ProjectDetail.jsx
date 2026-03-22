import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

const DELIVERABLE_STATUSES = ['Pending', 'In Progress', 'Done'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [allCrew, setAllCrew] = useState([]);
  const [crewModal, setCrewModal] = useState(false);
  const [crewForm, setCrewForm] = useState({ crew_id: '', role_on_project: '', day_rate: '', days_worked: '' });
  const [delivModal, setDelivModal] = useState(null);
  const [delivForm, setDelivForm] = useState({ title: '', status: 'Pending', due_date: '', notes: '' });

  useEffect(() => { load(); adminApi.get('/crew').then(r => setAllCrew(r.data)); }, [id]);

  async function load() {
    const res = await adminApi.get(`/projects/${id}`);
    setProject(res.data);
  }

  async function assignCrew(e) {
    e.preventDefault();
    await adminApi.post(`/projects/${id}/crew`, { ...crewForm, day_rate: parseFloat(crewForm.day_rate) || 0, days_worked: parseFloat(crewForm.days_worked) || 0 });
    setCrewModal(false);
    setCrewForm({ crew_id: '', role_on_project: '', day_rate: '', days_worked: '' });
    load();
  }

  async function removeCrew(crewId) {
    if (!confirm('Remove from project?')) return;
    await adminApi.delete(`/projects/${id}/crew/${crewId}`);
    load();
  }

  async function saveDeliverable(e) {
    e.preventDefault();
    if (delivModal === 'add') {
      await adminApi.post(`/projects/${id}/deliverables`, delivForm);
    } else {
      await adminApi.put(`/projects/${id}/deliverables/${delivModal.id}`, delivForm);
    }
    setDelivModal(null);
    load();
  }

  async function deleteDeliverable(did) {
    await adminApi.delete(`/projects/${id}/deliverables/${did}`);
    load();
  }

  async function toggleDeliverable(d) {
    const next = d.status === 'Done' ? 'Pending' : d.status === 'Pending' ? 'In Progress' : 'Done';
    await adminApi.put(`/projects/${id}/deliverables/${d.id}`, { ...d, status: next });
    load();
  }

  if (!project) return <div className="text-slate-400 text-sm">Loading…</div>;

  const f = project.financials || {};
  const assignedCrewIds = new Set(project.crew.map(c => c.crew_id));
  const unassigned = allCrew.filter(c => !assignedCrewIds.has(c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/projects" className="text-sm text-slate-400 hover:text-slate-600">Projects</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600">{project.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              {project.is_shoot && <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">📍 Shoot</span>}
            </div>
            {project.client_name && (
              <p className="text-slate-500 mt-1">
                Client: <Link to={`/clients/${project.client_id}`} className="text-indigo-600 hover:underline">{project.client_name}</Link>
              </p>
            )}
          </div>
          <Badge label={project.status} />
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
          {project.start_date && <span>📅 {project.start_date}{project.end_date ? ` → ${project.end_date}` : ''}</span>}
          {project.shoot_location && <span>📍 {project.shoot_location}{project.shoot_address ? `, ${project.shoot_address}` : ''}</span>}
        </div>
        {project.description && <p className="mt-3 text-sm text-slate-600">{project.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financials */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Financials</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Revenue</span><span className="font-medium text-green-600">${(f.revenue || 0).toLocaleString()}</span></div>
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <div className="flex justify-between text-slate-500"><span>Crew cost</span><span>−${(f.crewCost || 0).toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-500"><span>Rental cost</span><span>−${(f.rentalCost || 0).toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-500"><span>Other cost</span><span>−${(f.otherCost || 0).toLocaleString()}</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="flex justify-between font-medium"><span className="text-slate-600">Total Cost</span><span className="text-red-500">−${(f.totalCost || 0).toLocaleString()}</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="flex justify-between font-bold text-base">
                <span className="text-slate-700">Profit</span>
                <span className={(f.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>${(f.profit || 0).toLocaleString()}</span>
              </div>
              {f.revenue > 0 && (
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500 text-xs">Margin</span>
                  <span className={`text-xs font-medium ${(f.margin || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{(f.margin || 0).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crew Roster */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Crew Roster</h2>
            {unassigned.length > 0 && (
              <button onClick={() => setCrewModal(true)} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">+ Add Crew</button>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {project.crew.length === 0 && <p className="p-5 text-sm text-slate-400">No crew assigned</p>}
            {project.crew.map(c => {
              const cost = (c.day_rate || 0) * (c.days_worked || 0);
              const confirmed = c.confirmed === 1 ? 'Confirmed' : c.confirmed === 0 ? 'Declined' : 'Pending2';
              return (
                <div key={c.crew_id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <Link to={`/crew/${c.crew_id}`} className="text-sm font-medium text-indigo-600 hover:underline">{c.name}</Link>
                    <p className="text-xs text-slate-500">{c.role_on_project || c.role || '—'} {c.day_rate > 0 ? `• $${c.day_rate}/day × ${c.days_worked}d` : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {cost > 0 && <span className="text-sm text-slate-600">${cost.toLocaleString()}</span>}
                    <Badge label={confirmed} />
                    <button onClick={() => removeCrew(c.crew_id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Deliverables</h2>
          <button onClick={() => { setDelivForm({ title: '', status: 'Pending', due_date: '', notes: '' }); setDelivModal('add'); }} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">+ Add</button>
        </div>
        <div className="divide-y divide-slate-100">
          {project.deliverables.length === 0 && <p className="p-5 text-sm text-slate-400">No deliverables</p>}
          {project.deliverables.map(d => (
            <div key={d.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleDeliverable(d)} className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center hover:border-indigo-500">
                  {d.status === 'Done' && <span className="text-green-500 text-xs">✓</span>}
                  {d.status === 'In Progress' && <span className="text-yellow-500 text-xs">●</span>}
                </button>
                <div>
                  <p className={`text-sm font-medium ${d.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{d.title}</p>
                  {d.due_date && <p className="text-xs text-slate-400">Due {d.due_date}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={d.status} />
                <button onClick={() => { setDelivForm({ ...d }); setDelivModal(d); }} className="text-xs text-slate-400 hover:text-indigo-600">Edit</button>
                <button onClick={() => deleteDeliverable(d.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Events / Shoots</h2>
          <Link to="/schedule" className="text-xs text-indigo-600 hover:underline">Manage in Schedule</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {project.events.length === 0 && <p className="p-5 text-sm text-slate-400">No events linked</p>}
          {project.events.map(ev => (
            <div key={ev.id} className="px-5 py-3">
              <p className="text-sm font-medium text-slate-800">{ev.title}</p>
              <p className="text-xs text-slate-500">
                {ev.start_datetime} {ev.call_time ? `• Call: ${ev.call_time}` : ''} {ev.location ? `• ${ev.location}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Invoices</h2>
          <Link to="/invoices" className="text-xs text-indigo-600 hover:underline">Manage Invoices</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {project.invoices.length === 0 && <p className="p-5 text-sm text-slate-400">No invoices</p>}
          {project.invoices.map(inv => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{inv.invoice_number || `INV-${inv.id}`}</p>
                {inv.due_date && <p className="text-xs text-slate-400">Due {inv.due_date}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge label={inv.status} />
                <span className="text-sm font-medium text-slate-700">${inv.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crew Assignment Modal */}
      {crewModal && (
        <Modal title="Assign Crew" onClose={() => setCrewModal(false)}>
          <form onSubmit={assignCrew} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Crew Member *</label>
              <select value={crewForm.crew_id} onChange={e => setCrewForm(p => ({ ...p, crew_id: e.target.value }))} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select crew…</option>
                {unassigned.map(c => <option key={c.id} value={c.id}>{c.name} {c.role ? `(${c.role})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role on Project</label>
              <input type="text" value={crewForm.role_on_project} onChange={e => setCrewForm(p => ({ ...p, role_on_project: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Day Rate ($)</label>
                <input type="number" min="0" step="0.01" value={crewForm.day_rate} onChange={e => setCrewForm(p => ({ ...p, day_rate: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Days</label>
                <input type="number" min="0" step="0.5" value={crewForm.days_worked} onChange={e => setCrewForm(p => ({ ...p, days_worked: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <p className="text-xs text-slate-400">An email will be sent to the crew member to confirm.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCrewModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Assign + Send Email</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Deliverable Modal */}
      {delivModal && (
        <Modal title={delivModal === 'add' ? 'Add Deliverable' : 'Edit Deliverable'} onClose={() => setDelivModal(null)}>
          <form onSubmit={saveDeliverable} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
              <input type="text" value={delivForm.title} onChange={e => setDelivForm(p => ({ ...p, title: e.target.value }))} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                <select value={delivForm.status} onChange={e => setDelivForm(p => ({ ...p, status: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {DELIVERABLE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
                <input type="date" value={delivForm.due_date} onChange={e => setDelivForm(p => ({ ...p, due_date: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
              <textarea value={delivForm.notes} onChange={e => setDelivForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setDelivModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
