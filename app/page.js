'use client';

import { useState, useEffect, useCallback } from 'react';
import BugTable from './components/BugTable';
import BugForm from './components/BugForm';
import FilterBar from './components/FilterBar';
import Modal from './components/Modal';

export default function Home() {
  const [bugs, setBugs] = useState([]);
  const [filters, setFilters] = useState({ priority: '', status: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.status) params.set('status', filters.status);

    const res = await fetch(`/api/bugs?${params.toString()}`);
    const data = await res.json();
    setBugs(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const handleCreate = async (form) => {
    await fetch('/api/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setIsModalOpen(false);
    fetchBugs();
  };

  const handleUpdate = async (form) => {
    await fetch(`/api/bugs/${editingBug._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditingBug(null);
    setIsModalOpen(false);
    fetchBugs();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bug?')) return;
    await fetch(`/api/bugs/${id}`, { method: 'DELETE' });
    fetchBugs();
  };

  const openCreateModal = () => {
    setEditingBug(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bug) => {
    setEditingBug(bug);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Bug Tracker</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Report Bug
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <BugTable bugs={bugs} onEdit={openEditModal} onDelete={handleDelete} />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingBug(null); }}
        title={editingBug ? 'Edit Bug' : 'Report New Bug'}
      >
        <BugForm
          bug={editingBug}
          onSubmit={editingBug ? handleUpdate : handleCreate}
          onCancel={() => { setIsModalOpen(false); setEditingBug(null); }}
        />
      </Modal>
    </div>
  );
}
