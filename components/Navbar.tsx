"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Briefcase } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";
  const isEmployer = session?.user.role === "EMPLOYER";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-emerald-600">
          <Briefcase className="w-5 h-5" />
          Yatma
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Iş bildirişler
          </Link>

          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 font-medium">
                  Admin paneli
                </Link>
              )}
              {isEmployer && (
                <>
                  <Link
                    href="/employer/post"
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700"
                  >
                    + Iş bildiriş ýerleşdir
                  </Link>
                  <Link href="/employer/dashboard" className="text-gray-600 hover:text-gray-900">
                    Meniň bildirişlerim
                  </Link>
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-500 hover:text-gray-900"
              >
                Çykmak
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Giriş
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700"
              >
                Iş bildiriş ýerleşdir
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
