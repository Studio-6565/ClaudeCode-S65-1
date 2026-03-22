import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '../../api';
import Badge from '../../components/Badge';

export default function PortalDashboard() {
  const [projects, setProjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    Promise.all([
      portalApi.get('/me'),
      portalApi.get('/projects'),
      portalApi.get('/schedule'),
    ]).then(([meRes, projRes, schedRes]) => {
      setMe(meRes.data);
      setProjects(projRes.data);
      setSchedule(schedRes.data);
    }).catch(console.error);
  }, []);

  const pendingConfirm = projects.filter(p => p.confirmed === null || p.confirmed === undefined);
  const upcoming = schedule.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back{me ? `, ${me.name}` : ''}</h1>
        {me?.role && <p className="text-slate-500 mt-1">{me.role}</p>}
      </div>

      {pendingConfirm.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚡ Action needed — {pendingConfirm.length} project{pendingConfirm.length > 1 ? 's' : ''} awaiting your confirmation</p>
          <div className="space-y-2">
            {pendingConfirm.map(p => (
              <Link key={p.id} to={`/portal/projects/${p.id}`} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-200 hover:bg-amber-50 transition-colors">
                <span className="text-sm font-medium text-slate-800">{p.name}</span>
                <span className="text-xs text-amber-600 font-medium">Confirm →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">My Projects</h2>
            <Link to="/portal/projects" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {projects.length === 0 && <p className="p-5 text-sm text-slate-400">No projects assigned</p>}
            {projects.slice(0, 4).map(p => (
              <Link key={p.id} to={`/portal/projects/${p.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.role_on_project || 'No role assigned'}{p.start_date ? ` • ${p.start_date}` : ''}</p>
                </div>
                <Badge label={p.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Upcoming Events</h2>
            <Link to="/portal/schedule" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcoming.length === 0 && <p className="p-5 text-sm text-slate-400">No upcoming events</p>}
            {upcoming.map(ev => (
              <div key={ev.id} className="p-4">
                <p className="text-sm font-medium text-slate-800">{ev.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(ev.start_datetime).toLocaleDateString()}
                  {ev.personal_call_time ? ` • Call: ${ev.personal_call_time}` : ev.call_time ? ` • Call: ${ev.call_time}` : ''}
                  {ev.location ? ` • ${ev.location}` : ''}
                </p>
                {ev.project_name && <p className="text-xs text-indigo-500 mt-0.5">{ev.project_name}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
