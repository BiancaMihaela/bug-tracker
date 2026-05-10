'use client';

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || priorityColors.medium}`}>
      {priority}
    </span>
  );
}
