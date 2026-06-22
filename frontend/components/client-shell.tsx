import Link from 'next/link';
import { BookOpen, Home, LifeBuoy, MessageCircle, UserRound } from 'lucide-react';

const nav = [
  { href: '/client', label: 'Главная', icon: Home },
  { href: '/client/help', label: 'Нужна помощь', icon: LifeBuoy },
  { href: '/client/requests', label: 'Мои обращения', icon: MessageCircle },
  { href: '/client/knowledge', label: 'Инструкции', icon: BookOpen },
];

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/client" className="font-bold">Kord Support</Link>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            <UserRound className="h-4 w-4" />
            demo@example.local
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 border-t bg-white md:hidden">
        <div className="grid grid-cols-4">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-2 py-3 text-xs text-slate-600">
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <aside className="fixed left-4 top-24 hidden w-52 md:block">
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm hover:bg-slate-100">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
