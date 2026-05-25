"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseLinks = [
  { href: "/questions", label: "Questions", match: (p: string) => p === "/questions" },
  { href: "/questions/propose", label: "Propose", match: (p: string) => p.startsWith("/questions/propose") },
];

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname() ?? "";
  const links = isAdmin
    ? [
        ...baseLinks,
        { href: "/admin", label: "Admin", match: (p: string) => p.startsWith("/admin") },
      ]
    : baseLinks;

  return (
    <div className="hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-md px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
