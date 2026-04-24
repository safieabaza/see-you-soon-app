'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createBookingCheckout, fetchProperty } from '@/lib/api';

type Props = {
  params: { slug: string };
};

export default function PropertyDetailPage({ params }: Props) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('4');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    fetchProperty(params.slug)
      .then((result) => {
        setProperty(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const handleCheckout = async () => {
    if (!property) return;
    setCheckoutError('');

    if (!checkIn || !checkOut || !contactName || !contactPhone) {
      setCheckoutError('Please complete all booking details.');
      return;
    }

    setCheckoutLoading(true);
    const payload = {
      propertyId: property.id,
      checkIn,
      checkOut,
      guests,
      contactName,
      contactPhone,
      contactEmail
    };

    try {
      const result = await createBookingCheckout(payload);
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setCheckoutError(result.message || 'Unable to start checkout.');
      }
    } catch (error) {
      setCheckoutError('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-10 text-center text-slate-600">Loading property details…</div>;
  }

  if (!property) {
    return <div className="container py-10 text-center text-slate-600">Property not found.</div>;
  }

  return (
    <main className="container py-10">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.75fr]">
        <section>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Property details</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">{property.title}</h1>
          <p className="mt-3 text-slate-600">{property.address}, {property.city}, {property.country}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {property.images.map((src: string, index: number) => (
              <div key={index} className="relative h-72 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <Image src={src} alt={`${property.title} image ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-4 text-slate-600">{property.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">Bedrooms<br/><strong>{property.bedrooms}</strong></div>
              <div className="rounded-3xl bg-slate-50 p-5">Bathrooms<br/><strong>{property.bathrooms}</strong></div>
              <div className="rounded-3xl bg-slate-50 p-5">Guests<br/><strong>{property.guests}</strong></div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">From</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">${property.pricePerNight.toFixed(0)}/night</p>
            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Check-in</label>
                <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Check-out</label>
                <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Guests</label>
                <input type="number" min={1} value={guests} onChange={(event) => setGuests(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Book your stay</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Your name" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="+20 1XXXXXXXXX" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none" />
              </div>
            </div>
            {checkoutError && <p className="mt-4 text-sm text-red-600">{checkoutError}</p>}
            <button onClick={handleCheckout} className="mt-6 w-full rounded-2xl bg-brand-600 px-6 py-4 text-white transition hover:bg-brand-700" disabled={checkoutLoading}>
              {checkoutLoading ? 'Starting checkout…' : 'Reserve & Pay'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
            <div className="mt-4 grid gap-3">
              {property.amenities.map((amenity: any) => (
                <span key={amenity.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{amenity.name}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
