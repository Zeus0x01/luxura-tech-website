"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Home, Inbox, LayoutDashboard, LogOut, Menu, Settings, Layers, Factory, X } from "lucide-react";
import { Logo } from "@/components/public/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/industries", label: "Industries", icon: Factory },
  { href: "/admin/articles", label: "Insights", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  user,
  newLeads,
  logout,
  children,
}: {
  user: { name: string; email: string };
  newLeads: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-4">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className={cn("size-4", active && "text-lime-400")} />
            {label}
            {href === "/admin/leads" && newLeads > 0 && (
              <span className="ml-auto rounded-full bg-lime-400 px-2 py-0.5 text-xs font-bold text-navy-950">{newLeads}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 p-4">
      <p className="truncate text-sm font-medium text-white">{user.name}</p>
      <p className="truncate text-xs text-white/50">{user.email}</p>
      <div className="mt-3 flex items-center gap-3">
        <a href="/" target="_blank" rel="noopener" className="text-xs font-medium text-white/65 hover:text-white">
          View site ↗
        </a>
        <form action={logout} className="ml-auto">
          <button type="submit" className="inline-flex items-center gap-1.5 text-xs font-medium text-white/65 hover:text-white">
            <LogOut className="size-3.5" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="on-dark fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy-950 lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo tone="onDark" className="h-8" />
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="on-dark sticky top-0 z-40 flex h-14 items-center justify-between bg-navy-950 px-4 lg:hidden">
        <Logo tone="onDark" className="h-7" />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="on-dark fixed inset-x-0 bottom-0 top-14 z-30 flex flex-col overflow-y-auto bg-navy-950 lg:hidden">
          {nav}
          {footer}
        </div>
      )}

      <div className="text-navy-900">{children}</div>
    </div>
  );
}
