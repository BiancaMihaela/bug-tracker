'use client';

import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function BugTable({ bugs, onEdit, onDelete }) {
  if (bugs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No bugs found. Click "Report Bug" to create one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Reporter</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bugs.map((bug) => (
            <tr key={bug._id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{bug.title}</div>
                <div className="text-gray-500 text-xs truncate max-w-xs">{bug.description}</div>
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={bug.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={bug.status} />
              </td>
              <td className="px-4 py-3 text-gray-600">{bug.reporterEmail}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {new Date(bug.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(bug)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(bug._id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
