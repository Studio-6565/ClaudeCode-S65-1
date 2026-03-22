const colors = {
  // Project statuses
  Lead: 'bg-slate-100 text-slate-600',
  'Pre-Production': 'bg-blue-100 text-blue-700',
  Active: 'bg-green-100 text-green-700',
  'Post-Production': 'bg-purple-100 text-purple-700',
  Completed: 'bg-slate-200 text-slate-500',
  Archived: 'bg-slate-100 text-slate-400',
  // Invoice statuses
  Draft: 'bg-slate-100 text-slate-500',
  Sent: 'bg-blue-100 text-blue-600',
  Partial: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-green-100 text-green-700',
  Overdue: 'bg-red-100 text-red-700',
  // Deliverable
  Pending: 'bg-slate-100 text-slate-500',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Done: 'bg-green-100 text-green-700',
  // Confirmation
  Confirmed: 'bg-green-100 text-green-700',
  Declined: 'bg-red-100 text-red-600',
  Pending2: 'bg-yellow-100 text-yellow-700',
};

export default function Badge({ label }) {
  const cls = colors[label] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
