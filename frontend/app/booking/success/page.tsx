export default function BookingSuccessPage() {
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-16 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Booking confirmed</p>
        <h1 className="mt-6 text-5xl font-semibold text-slate-900">Your reservation is almost complete</h1>
        <p className="mt-6 text-lg text-slate-600">We have received your payment and are confirming your stay. A confirmation SMS will arrive shortly.</p>
      </div>
    </main>
  );
}
