import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import Modal from '../components/Modal';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const EMPTY = { title: '', project_id: '', start_datetime: '', end_datetime: '', location: '', address: '', parking_notes: '', call_time: '', general_notes: '' };

export default function Schedule() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allCrew, setAllCrew] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [crewModal, setCrewModal] = useState(false);
  const [crewForm, setCrewForm] = useState({ crew_id: '', personal_call_time: '' });

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  useEffect(() => { loadEvents(); }, [monthStr]);
  useEffect(() => {
    adminApi.get('/projects').then(r => setProjects(r.data));
    adminApi.get('/crew').then(r => setAllCrew(r.data));
  }, []);

  async function loadEvents() {
    const res = await adminApi.get('/events', { params: { month: monthStr } });
    setEvents(res.data);
  }

  async function loadEventDetail(id) {
    const res = await adminApi.get(`/events/${id}`);
    setSelectedEvent(res.data);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function openAdd(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setForm({ ...EMPTY, start_datetime: `${dateStr}T09:00` });
    setModal('add');
  }

  async function save(e) {
    e.preventDefault();
    if (modal === 'add') await adminApi.post('/events', form);
    else await adminApi.put(`/events/${modal.id}`, form);
    setModal(null);
    loadEvents();
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    await adminApi.delete(`/events/${id}`);
    setSelectedEvent(null);
    loadEvents();
  }

  async function addCrewToEvent(e) {
    e.preventDefault();
    await adminApi.post(`/events/${selectedEvent.id}/crew`, crewForm);
    setCrewModal(false);
    loadEventDetail(selectedEvent.id);
  }

  async function removeCrewFromEvent(crewId) {
    await adminApi.delete(`/events/${selectedEvent.id}/crew/${crewId}`);
    loadEventDetail(selectedEvent.id);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  // Map events to days
  const eventsByDay = {};
  events.forEach(ev => {
    const d = new Date(ev.start_datetime).getDate();
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(ev);
  });

  const assignedCrewIds = selectedEvent ? new Set(selectedEvent.crew?.map(c => c.crew_id)) : new Set();
  const unassignedCrew = allCrew.filter(c => !assignedCrewIds.has(c.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        <button onClick={() => { setForm(EMPTY); setModal('add'); }} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
          + New Event
        </button>
      </div>

      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "14px", overflow: "hidden" }}>
        {/* Month navigation */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">◀</button>
          <h2 className="font-semibold text-white">{monthName} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">▶</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-zinc-900">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-zinc-600 py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-20 border-r border-b border-zinc-900 bg-zinc-950/50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = eventsByDay[day] || [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div
                key={day}
                onClick={() => openAdd(day)}
                className="min-h-20 border-r border-b border-zinc-900 p-1.5 cursor-pointer hover:bg-zinc-950 transition-colors"
              >
                <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-red-600 text-white' : 'text-zinc-400'}`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); loadEventDetail(ev.id); }}
                      className="text-xs bg-red-100 text-red-700 rounded px-1.5 py-0.5 truncate cursor-pointer hover:bg-red-200"
                    >
                      {ev.call_time ? `${ev.call_time} ` : ''}{ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event detail panel */}
      {selectedEvent && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "14px", padding: "20px" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-white text-lg">{selectedEvent.title}</h2>
              {selectedEvent.project_name && <p className="text-sm text-red-600">{selectedEvent.project_name}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm({ ...selectedEvent, project_id: selectedEvent.project_id || '' }); setModal(selectedEvent); }} className="text-xs text-zinc-500 hover:text-red-600 px-2 py-1 border border-zinc-800 rounded">Edit</button>
              <button onClick={() => deleteEvent(selectedEvent.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 border border-red-200 rounded">Delete</button>
              <button onClick={() => setSelectedEvent(null)} className="text-zinc-600 hover:text-zinc-400">✕</button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {selectedEvent.start_datetime && <div><p className="text-xs text-zinc-600">Date/Time</p><p className="text-zinc-200">{selectedEvent.start_datetime}</p></div>}
            {selectedEvent.call_time && <div><p className="text-xs text-zinc-600">Call Time</p><p className="text-zinc-200">{selectedEvent.call_time}</p></div>}
            {selectedEvent.location && <div><p className="text-xs text-zinc-600">Location</p><p className="text-zinc-200">{selectedEvent.location}</p></div>}
            {selectedEvent.parking_notes && <div><p className="text-xs text-zinc-600">Parking</p><p className="text-zinc-200">{selectedEvent.parking_notes}</p></div>}
          </div>
          {selectedEvent.address && <p className="text-sm text-zinc-500 mt-2">📍 {selectedEvent.address}</p>}
          {selectedEvent.general_notes && <p className="text-sm text-zinc-400 mt-2 bg-zinc-950 rounded p-2">{selectedEvent.general_notes}</p>}

          {/* Crew on event */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-200">Crew on this event</p>
              {unassignedCrew.length > 0 && (
                <button onClick={() => { setCrewForm({ crew_id: '', personal_call_time: '' }); setCrewModal(true); }} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">+ Add</button>
              )}
            </div>
            {(selectedEvent.crew || []).length === 0 && <p className="text-xs text-zinc-600">No crew assigned</p>}
            <div className="flex flex-wrap gap-2">
              {(selectedEvent.crew || []).map(c => (
                <div key={c.crew_id} className="flex items-center gap-1 bg-zinc-800 rounded-full px-3 py-1">
                  <span className="text-xs text-zinc-200">{c.name}</span>
                  {c.personal_call_time && <span className="text-xs text-zinc-600">({c.personal_call_time})</span>}
                  <button onClick={() => removeCrewFromEvent(c.crew_id)} className="text-zinc-600 hover:text-red-500 ml-1 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event form modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'New Event' : 'Edit Event'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Project</label>
              <select value={form.project_id} onChange={e => setForm(p => ({ ...p, project_id: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Start *</label>
                <input type="datetime-local" value={form.start_datetime} onChange={e => setForm(p => ({ ...p, start_datetime: e.target.value }))} required className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">End</label>
                <input type="datetime-local" value={form.end_datetime} onChange={e => setForm(p => ({ ...p, end_datetime: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Call Time</label>
              <input type="time" value={form.call_time} onChange={e => setForm(p => ({ ...p, call_time: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Parking Notes</label>
              <input type="text" value={form.parking_notes} onChange={e => setForm(p => ({ ...p, parking_notes: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">General Notes</label>
              <textarea value={form.general_notes} onChange={e => setForm(p => ({ ...p, general_notes: e.target.value }))} rows={2} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Save</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add crew to event modal */}
      {crewModal && (
        <Modal title="Add Crew to Event" onClose={() => setCrewModal(false)}>
          <form onSubmit={addCrewToEvent} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Crew Member *</label>
              <select value={crewForm.crew_id} onChange={e => setCrewForm(p => ({ ...p, crew_id: e.target.value }))} required className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select…</option>
                {unassignedCrew.map(c => <option key={c.id} value={c.id}>{c.name}{c.role ? ` (${c.role})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Personal Call Time</label>
              <input type="time" value={crewForm.personal_call_time} onChange={e => setCrewForm(p => ({ ...p, personal_call_time: e.target.value }))} className="w-full border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCrewModal(false)} className="px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Add + Send Email</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
