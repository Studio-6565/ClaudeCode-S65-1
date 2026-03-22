import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '../../api';

export default function PortalSchedule() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    portalApi.get('/schedule').then(r => setEvents(r.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">My Schedule</h1>
      <p className="text-sm text-slate-500">Upcoming events you're assigned to</p>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          No upcoming events
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-slate-800">{ev.title}</h2>
                  {ev.project_name && (
                    <Link to={`/portal/projects/${ev.project_id}`} className="text-sm text-indigo-500 hover:underline">
                      {ev.project_name}
                    </Link>
                  )}
                </div>
                {(ev.personal_call_time || ev.call_time) && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Your call time</p>
                    <p className="text-lg font-bold text-indigo-600">{ev.personal_call_time || ev.call_time}</p>
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Date & Time</p>
                  <p className="text-slate-700">{new Date(ev.start_datetime).toLocaleString()}</p>
                </div>
                {ev.location && (
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-slate-700">📍 {ev.location}</p>
                  </div>
                )}
                {ev.address && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-slate-700">{ev.address}</p>
                  </div>
                )}
                {ev.parking_notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">Parking</p>
                    <p className="text-slate-600">🅿️ {ev.parking_notes}</p>
                  </div>
                )}
              </div>

              {ev.general_notes && (
                <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3">{ev.general_notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
