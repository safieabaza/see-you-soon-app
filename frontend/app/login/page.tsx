'use client';

import { useState } from 'react';
import { loginUser, saveAuthToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    try {
      const result = await loginUser(email, password);
      saveAuthToken(result.token);
      setMessage('Logged in successfully.');
    } catch (error) {
      setMessage('Login failed. Check your credentials.');
    }
  };

  return (
    <main className="container py-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Login</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Sign in to manage bookings and leads</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="admin@seeyousoon.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="Your password" />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-brand-600 px-6 py-4 text-white transition hover:bg-brand-700">Sign in</button>
        </form>
        {message && <p className="mt-6 text-sm text-brand-700">{message}</p>}
      </div>
    </main>
  );
}
