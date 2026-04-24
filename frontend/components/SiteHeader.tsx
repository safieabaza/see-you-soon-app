'use client';

import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-slate-700">
        <Link href="/" className="font-semibold text-slate-900">See You Soon</Link>
        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/properties" className="rounded-full px-4 py-2 transition hover:bg-slate-100">Properties</Link>
          <Link href="/admin" className="rounded-full px-4 py-2 transition hover:bg-slate-100">Admin</Link>
          <Link href="/sales" className="rounded-full px-4 py-2 transition hover:bg-slate-100">Sales</Link>
          <Link href="/login" className="rounded-full bg-brand-600 px-4 py-2 text-white transition hover:bg-brand-700">Login</Link>
        </nav>
      </div>
    </header>
  );
}
