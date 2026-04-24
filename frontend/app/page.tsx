'use client';

import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { fetchProperties } from '@/lib/api';

const initialFilters = { city: '', minPrice: '', maxPrice: '', guests: '' };

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties(filters);
  }, []);

  const loadProperties = async (params: any) => {
    setLoading(true);
    const data = await fetchProperties(params);
    setProperties(data ?? []);
    setLoading(false);
  };

  return (
    <main>
      <section className="container py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600">See You Soon</p>
            <h1 className="mt-6 text-5xl font-semibold text-slate-900 sm:text-6xl">Find your perfect vacation stay on Egypt's North Coast.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Search premium villas, beachfront apartments, and luxury homes with smart booking, CRM leads, admin control, and payment support.</p>
          </div>
          <div className="mt-12">
            <SearchBar onSearch={(values) => {
              setFilters(values);
              loadProperties(values);
            }} />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Featured collection</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Top vacation properties</h2>
          </div>
          <div className="text-sm text-slate-500">{properties.length} results</div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Loading properties…</div>
          ) : properties.length ? (
            properties.map((property) => <PropertyCard key={property.id} property={property} />)
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">No properties matched your search.</div>
          )}
        </div>
      </section>
    </main>
  );
}
