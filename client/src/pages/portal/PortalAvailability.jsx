import { useEffect, useState } from 'react';
import { portalApi } from '../../api';

export default function PortalAvailability() {
  const [unavailability, setUnavailability] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await portalApi.get('/availability');
    setUnavailability(res.data);
  }

  async function add(e) {
    e.preventDefault();
    if (!newDate) return;
    await portalApi.post('/availability', { date: newDate, note });
    setNewDate('');
    setNote('');
    load();
  }

  async function remove(id) {
    await portalApi.delete(`/availability/${id}`);
    load();
  }

  // Group by month
  const byMonth = {};
  unavailability.forEach(u => {
    const m = u.date.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(u);
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">My Availability</h1>
      <p className="text-sm text-slate-500">Mark dates you're unavailable so the studio knows when not to book you.</p>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-medium text-slate-700 mb-3">Mark unavailable date</h2>
        <form onSubmit={add} className="flex gap-3 flex-wrap">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 10)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            placeholder="Reason (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="submit" className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
            Add Date
          </button>
        </form>
      </div>

      {unavailability.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          No unavailable dates set
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(byMonth).sort().map(([month, dates]) => (
            <div key={month} className="bg-white rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="divide-y divide-slate-100">
                {dates.map(u => (
                  <div key={u.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <span className="text-sm font-medium text-red-600">{new Date(u.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {u.note && <span className="text-xs text-slate-500 ml-2">{u.note}</span>}
                    </div>
                    <button onClick={() => remove(u.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
