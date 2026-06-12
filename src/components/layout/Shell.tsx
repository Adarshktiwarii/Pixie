"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Clock,
  FileText,
  Activity,
  FolderOpen,
  Users,
  User,
  Sparkles,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import { usePixie } from "@/lib/context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Passport", href: "/passport", icon: FileText },
  { name: "Growth", href: "/growth", icon: Activity },
  { name: "Vault", href: "/documents", icon: FolderOpen },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoaded, logout } = usePixie();

  useEffect(() => {
    if (isLoaded && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoaded, isAuthenticated, pathname, router]);

  if (!isLoaded || (!isAuthenticated && pathname !== "/login")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
          <p className="text-slate-500 font-medium text-sm">Loading Pixie...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex print:hidden">
        <div className="flex h-16 shrink-0 items-center px-6">
          <span className="text-xl font-bold tracking-tight text-primary">
            Pixie
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <div className="mt-auto pt-4 flex flex-col gap-2">
            <Link
              href="/ai"
              className={cn(
                "flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:from-amber-500/20 hover:to-orange-500/20",
                pathname === "/ai" && "from-amber-500/20 to-orange-500/20"
              )}
            >
              <Sparkles className="h-5 w-5" />
              Pixie AI
            </Link>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col pb-20 md:pb-0 print:pb-0">
        <div className="md:hidden flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 print:hidden">
          <span className="text-lg font-bold tracking-tight text-primary">
            Pixie
          </span>
          <Link href="/ai" className="text-amber-500">
            <Sparkles className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          <div className="mx-auto max-w-5xl p-4 md:p-8 lg:p-10 print:p-0 print:max-w-none">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card/80 px-2 backdrop-blur-lg md:hidden print:hidden overflow-x-auto gap-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium text-muted-foreground transition-colors hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Log Out</span>
        </button>
      </nav>
    </div>
  );
}
