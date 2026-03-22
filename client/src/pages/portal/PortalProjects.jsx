import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '../../api';
import Badge from '../../components/Badge';

export default function PortalProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    portalApi.get('/projects').then(r => setProjects(r.data)).catch(console.error);
  }, []);

  const confirmLabel = v => v === 1 ? 'Confirmed' : v === 0 ? 'Declined' : 'Pending2';

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
            No projects assigned to you yet
          </div>
        )}
        {projects.map(p => (
          <Link
            key={p.id}
            to={`/portal/projects/${p.id}`}
            className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-800">{p.name}</h2>
                  {p.is_shoot && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">📍 Shoot</span>}
                </div>
                <p className="text-sm text-indigo-600 mt-0.5">{p.role_on_project || 'Crew'}</p>
                {(p.start_date || p.end_date) && (
                  <p className="text-xs text-slate-400 mt-1">
                    {p.start_date}{p.end_date ? ` → ${p.end_date}` : ''}
                  </p>
                )}
                {p.shoot_location && <p className="text-xs text-slate-500 mt-1">📍 {p.shoot_location}</p>}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge label={p.status} />
                <Badge label={confirmLabel(p.confirmed)} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
