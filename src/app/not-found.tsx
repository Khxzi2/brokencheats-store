import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col items-center justify-center px-4 text-center py-20">
      <div className="glass-card-brokencheats p-8 md:p-12 rounded-3xl max-w-md space-y-6 border border-blue-500/30">
        <h1 className="text-6xl font-black text-blue-500 italic">404</h1>
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wide">
          Optimization Asset Not Found
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The custom URL slug you requested does not exist or has been hidden by staff administrators.
        </p>
        <Link
          href="/assets"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30"
        >
          Return to Asset Catalog
        </Link>
      </div>
    </div>
  );
}
