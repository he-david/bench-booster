import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import NavLinks from "./NavLinks";

function initials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function NavBar() {
  const session = await auth();
  if (!session?.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/questions"
            className="group flex items-center gap-2"
            aria-label="Bench Booster home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-[11px] font-bold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-transform group-hover:scale-105">
              BB
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Bench Booster
            </span>
          </Link>
          <NavLinks isAdmin={isAdmin} />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-200"
              aria-hidden
            >
              {initials(session.user.name)}
            </span>
            <span className="text-xs font-medium text-slate-700">
              {session.user.name}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
