'use client';

import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties({}).then((result) => {
      setProperties(result ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="container py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Properties</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Browse available stays</h1>
        <p className="mt-3 text-slate-600">Explore curated vacation rentals built for travelers and local sales teams.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Loading properties…</div>
        ) : properties.length ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">No properties available.</div>
        )}
      </div>
    </main>
  );
}
