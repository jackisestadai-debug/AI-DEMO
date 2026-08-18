import Link from "next/link";
import { company } from "@/lib/company";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          {company.brand} drivs av {company.legalName}, org.nr {company.orgNumber}
        </p>
        <nav className="flex gap-6">
          <Link href="/angerratt" className="hover:text-gray-900">
            Ångerrätt
          </Link>
          <Link href="/integritetspolicy" className="hover:text-gray-900">
            Integritetspolicy
          </Link>
          <Link href="/kontakt" className="hover:text-gray-900">
            Kontakt
          </Link>
        </nav>
      </div>
    </footer>
  );
}
