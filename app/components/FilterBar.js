'use client';

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}
