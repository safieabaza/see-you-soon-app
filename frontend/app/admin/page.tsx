'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders, getAuthToken } from '@/lib/auth';
import { fetchAdminStats } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const headers = getAuthHeaders();
  const isLoggedIn = !!getAuthToken();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchAdminStats(headers)
      .then((data) => setStats(data))
      .catch(() => setError('Unable to fetch analytics.'));
  }, [headers, isLoggedIn]);

  return (
    <main className="container py-10">
      <div className="rounded-[2rem] bg-white p-10 shadow-lg">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Admin dashboard</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Manage properties, leads, bookings, and ads</h1>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Visits</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.totalVisits ?? '--'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Leads</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.leadsCount ?? '--'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Conversion</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stats ? `${stats.conversionRate}%` : '--'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Top ads</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.adsPerformance?.length ?? '--'}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Top properties</h2>
            <div className="mt-6 space-y-4">
              {stats?.topProperties?.map((property: any) => (
                <div key={property.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{property.title}</p>
                  <p className="text-sm text-slate-600">{property.city} • {property.bookings?.length ?? 0} bookings</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Ads performance</h2>
            <div className="mt-6 space-y-4">
              {stats?.adsPerformance?.map((ad: any) => (
                <div key={ad.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{ad.title}</p>
                  <p className="text-sm text-slate-600">{ad.impressions} impressions • {ad.clicks} clicks</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
