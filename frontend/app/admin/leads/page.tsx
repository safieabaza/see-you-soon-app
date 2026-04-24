'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthHeaders, getAuthToken } from '@/lib/auth';
import { addLeadNote, fetchLeads, updateLeadStatus } from '@/lib/api';

const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const;

type Lead = {
  id: string;
  name: string;
  phone: string;
  interests: string;
  status: string;
  notes: Array<{ id: string; content: string; createdAt: string }>;
};

export default function LeadPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  const headers = getAuthHeaders();
  const isLoggedIn = !!getAuthToken();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchLeads(headers).then((data) => setLeads(data)).catch(() => setError('Unable to fetch leads.'));
  }, [isLoggedIn]);

  const buckets = useMemo(() => {
    return statuses.map((status) => ({
      status,
      items: leads.filter((lead) => lead.status === status)
    }));
  }, [leads]);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      const updated = await updateLeadStatus(leadId, status, headers);
      setLeads((prev) => prev.map((lead) => (lead.id === updated.id ? updated : lead)));
    } catch {
      setError('Unable to update lead status.');
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !noteText.trim()) return;
    try {
      const note = await addLeadNote(selectedLead.id, noteText.trim(), 'guest@seeyousoon.com', headers);
      setLeads((prev) => prev.map((lead) => (lead.id === selectedLead.id ? { ...lead, notes: [...lead.notes, note] } : lead)));
      setNoteText('');
    } catch {
      setError('Unable to add note.');
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="container py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">Lead Pipeline</h1>
          <p className="mt-4 text-slate-600">Please log in to view and manage pipeline leads.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">CRM pipeline</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">Manage leads and conversions</h1>
            </div>
            <p className="text-sm text-slate-500">Drag the pipeline and update statuses quickly.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            {buckets.map((bucket) => (
              <div key={bucket.status} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">{bucket.status}</h2>
                <p className="mt-2 text-sm text-slate-500">{bucket.items.length} leads</p>
                <div className="mt-6 space-y-4">
                  {bucket.items.map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="w-full rounded-3xl bg-white p-4 text-left shadow-sm transition hover:bg-slate-100"
                    >
                      <p className="font-semibold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-600">{lead.phone}</p>
                      <p className="mt-2 max-h-12 overflow-hidden text-sm text-slate-500">{lead.interests}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-1/4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">Lead details</h2>
            {!selectedLead ? (
              <p className="mt-4 text-slate-600">Select a lead to update status or add notes.</p>
            ) : (
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 text-lg text-slate-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Interest</p>
                  <p className="mt-1 text-slate-900">{selectedLead.interests}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(event) => handleStatusChange(selectedLead.id, event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Add note</label>
                  <textarea
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    className="mt-2 h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                    placeholder="Write next action or update..."
                  />
                  <button type="button" onClick={handleAddNote} className="mt-3 w-full rounded-2xl bg-brand-600 px-5 py-3 text-white transition hover:bg-brand-700">
                    Save note
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Notes</p>
                  <div className="mt-3 space-y-3">
                    {selectedLead.notes.map((note) => (
                      <div key={note.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">{note.content}</p>
                        <p className="mt-2 text-xs text-slate-500">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}
