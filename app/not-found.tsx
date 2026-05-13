import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-bold text-emerald-600 mb-4">404</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sahypa tapylmady</h2>
      <p className="text-gray-500 mb-6">Siz gözleýän sahypaňyz ýok ýa-da öçürildi.</p>
      <Link
        href="/"
        className="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 font-medium"
      >
        Baş sahypa
      </Link>
    </div>
  );
}
