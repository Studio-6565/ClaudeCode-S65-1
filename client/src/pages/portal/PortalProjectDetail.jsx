import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portalApi } from '../../api';
import Badge from '../../components/Badge';

export default function PortalProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const res = await portalApi.get(`/projects/${id}`);
    setProject(res.data);
  }

  async function confirm(value) {
    setSaving(true);
    try {
      await portalApi.put(`/projects/${id}/confirm`, { confirmed: value });
      load();
    } finally {
      setSaving(false);
    }
  }

  if (!project) return <div className="text-slate-400 text-sm">Loading…</div>;

  const confirmLabel = v => v === 1 ? 'Confirmed' : v === 0 ? 'Declined' : 'Pending';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to="/portal/projects" className="text-sm text-slate-400 hover:text-slate-600">My Projects</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600">{project.name}</span>
      </div>

      {/* Project card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              {project.is_shoot && <span className="bg-amber-100 text-amber-700 text-sm px-2 py-0.5 rounded-full">📍 Shoot</span>}
            </div>
            <p className="text-indigo-600 font-medium mt-1">{project.myRole || 'Crew'}</p>
            {project.client_name && <p className="text-sm text-slate-500 mt-1">Client: {project.client_name}</p>}
          </div>
          <Badge label={project.status} />
        </div>

        {(project.start_date || project.end_date) && (
          <p className="text-sm text-slate-600 mt-3">📅 {project.start_date}{project.end_date ? ` → ${project.end_date}` : ''}</p>
        )}

        {project.description && <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3">{project.description}</p>}

        {/* Confirmation */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-600 font-medium">Your status:</span>
          <Badge label={confirmLabel(project.confirmed)} />
          {project.confirmed !== 1 && (
            <button onClick={() => confirm(true)} disabled={saving} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50">
              ✓ Confirm
            </button>
          )}
          {project.confirmed !== 0 && (
            <button onClick={() => confirm(false)} disabled={saving} className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              Decline
            </button>
          )}
        </div>
      </div>

      {/* Call Sheet */}
      {project.is_shoot && (
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">📋 Call Sheet</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {project.start_date && <div><p className="text-xs text-slate-400 mb-0.5">Shoot Date</p><p className="font-medium text-slate-800">{project.start_date}</p></div>}
            {project.shoot_location && <div><p className="text-xs text-slate-400 mb-0.5">Location</p><p className="font-medium text-slate-800">{project.shoot_location}</p></div>}
            {project.shoot_address && <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">Address</p><p className="font-medium text-slate-800">{project.shoot_address}</p></div>}
          </div>
        </div>
      )}

      {/* Events on this project */}
      {project.events.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-800 p-5 border-b border-slate-100">Events</h2>
          <div className="divide-y divide-slate-100">
            {project.events.map(ev => (
              <div key={ev.id} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800">{ev.title}</p>
                  {(ev.personal_call_time || ev.call_time) && (
                    <span className="text-sm font-semibold text-indigo-600">Call: {ev.personal_call_time || ev.call_time}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{ev.start_datetime}</p>
                {ev.location && <p className="text-sm text-slate-600 mt-1">📍 {ev.location}{ev.address ? `, ${ev.address}` : ''}</p>}
                {ev.parking_notes && <p className="text-sm text-slate-500 mt-1">🅿️ {ev.parking_notes}</p>}
                {ev.general_notes && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded p-2">{ev.general_notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew (names + roles only) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Team</h2>
        {project.crew.length === 0 && <p className="text-sm text-slate-400">No other crew assigned</p>}
        <div className="flex flex-wrap gap-2">
          {project.crew.map((c, i) => (
            <div key={i} className="bg-slate-100 rounded-full px-3 py-1.5">
              <span className="text-sm font-medium text-slate-800">{c.name}</span>
              {(c.role_on_project || c.role) && <span className="text-xs text-slate-500 ml-1">({c.role_on_project || c.role})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables (status only) */}
      {project.deliverables.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Deliverables</h2>
          <div className="space-y-2">
            {project.deliverables.map(d => (
              <div key={d.id} className="flex items-center justify-between">
                <span className={`text-sm ${d.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{d.title}</span>
                <Badge label={d.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
