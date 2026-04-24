'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthHeaders, getAuthToken } from '@/lib/auth';
import { fetchLeads, updateLeadStatus } from '@/lib/api';

export default function SalesDashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState('');
  const headers = getAuthHeaders();
  const isLoggedIn = !!getAuthToken();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchLeads(headers).then((data) => setLeads(data)).catch(() => setError('Unable to load leads.'));
  }, [headers, isLoggedIn]);

  const counts = useMemo(() => {
    return {
      NEW: leads.filter((lead) => lead.status === 'NEW').length,
      CONTACTED: leads.filter((lead) => lead.status === 'CONTACTED').length,
      QUALIFIED: leads.filter((lead) => lead.status === 'QUALIFIED').length,
      CLOSED: leads.filter((lead) => lead.status === 'CLOSED').length
    };
  }, [leads]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updated = await updateLeadStatus(id, status, headers);
      setLeads((prev) => prev.map((lead) => (lead.id === updated.id ? updated : lead)));
    } catch {
      setError('Could not update lead status.');
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="container py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">Sales dashboard</h1>
          <p className="mt-4 text-slate-600">Please sign in to manage your assigned leads.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10">
      <div className="rounded-[2rem] bg-white p-10 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Sales dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Assigned leads and conversions</h1>
          </div>
          <p className="text-sm text-slate-500">Quickly update lead status and move deals forward.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map((status) => (
            <div key={status} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{status}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{counts[status as keyof typeof counts]}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-600">{lead.phone} · {lead.interests}</p>
                </div>
                <select
                  value={lead.status}
                  onChange={(event) => handleStatusUpdate(lead.id, event.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                  {['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
