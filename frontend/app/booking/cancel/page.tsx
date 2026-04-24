export default function BookingCancelPage() {
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-16 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Checkout canceled</p>
        <h1 className="mt-6 text-5xl font-semibold text-slate-900">Your booking was not completed</h1>
        <p className="mt-6 text-lg text-slate-600">No payment was taken. Feel free to return to the property page and try again.</p>
      </div>
    </main>
  );
}
