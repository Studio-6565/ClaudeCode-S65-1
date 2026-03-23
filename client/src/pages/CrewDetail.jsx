import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../api';
import Badge from '../components/Badge';

export default function CrewDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [dateNote, setDateNote] = useState('');

  useEffect(() => { load(); }, [id]);

  async function load() {
    const res = await adminApi.get(`/crew/${id}`);
    setMember(res.data);
  }

  async function addUnavailable() {
    if (!newDate) return;
    await adminApi.post(`/crew/${id}/unavailability`, { date: newDate, note: dateNote });
    setNewDate('');
    setDateNote('');
    load();
  }

  async function removeUnavailable(dateId) {
    await adminApi.delete(`/crew/${id}/unavailability/${dateId}`);
    load();
  }

  if (!member) return <div className="text-slate-400 text-sm">Loading…</div>;

  const confirmLabel = v => v === 1 ? 'Confirmed' : v === 0 ? 'Declined' : 'Pending';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/crew" className="text-sm text-slate-400 hover:text-slate-600">Crew</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600">{member.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">{member.name}</h1>
        {member.role && <p className="text-red-600 font-medium mt-1">{member.role}</p>}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
          {member.email && <a href={`mailto:${member.email}`} className="text-red-600 hover:underline">{member.email}</a>}
          {member.phone && <span>{member.phone}</span>}
        </div>
        {member.skills && <p className="mt-2 text-sm text-slate-500"><strong>Skills:</strong> {member.skills}</p>}
        {member.bio && <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{member.bio}</p>}
        {member.portal_code && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">Portal code:</span>
            <code className="text-sm bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono">{member.portal_code}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-800 p-5 border-b border-slate-100">Projects ({member.projects.length})</h2>
          <div className="divide-y divide-slate-100">
            {member.projects.length === 0 && <p className="p-5 text-sm text-slate-400">Not assigned to any projects</p>}
            {member.projects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} className="block p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.role_on_project || '—'} {p.day_rate > 0 ? `• $${p.day_rate}/day` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={confirmLabel(p.confirmed)} />
                    <Badge label={p.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Unavailability */}
        <div className="bg-white rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-800 p-5 border-b border-slate-100">Unavailable Dates</h2>
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={dateNote}
                onChange={e => setDateNote(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button onClick={addUnavailable} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Add</button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {member.unavailability.length === 0 && <p className="text-sm text-slate-400">No dates blocked</p>}
              {member.unavailability.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-red-700 font-medium">{u.date}</span>
                  {u.note && <span className="text-xs text-red-500 ml-2">{u.note}</span>}
                  <button onClick={() => removeUnavailable(u.id)} className="text-xs text-red-400 hover:text-red-600 ml-auto">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
