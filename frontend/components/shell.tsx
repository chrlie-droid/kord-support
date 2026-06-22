import Link from 'next/link';
import { BookOpen, Building2, Home, LifeBuoy, MessageCircle, Settings, Users } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/client', label: 'Клиентский портал', icon: MessageCircle },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/desk', label: 'Service Desk', icon: LifeBuoy },
  { href: '/objects', label: 'Объекты', icon: Building2 },
  { href: '/knowledge', label: 'База знаний', icon: BookOpen },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-slate-950 text-white md:block">
        <div className="px-6 py-6">
          <div className="text-xl font-bold">Kord Support</div>
          <div className="mt-1 text-xs text-slate-400">портал поддержки клиентов</div>
        </div>
        <nav className="space-y-1 px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <div className="font-semibold">Kord Support</div>
              <div className="text-xs text-slate-500">клиентский портал · заявки · чат · поддержка</div>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">demo@example.local</div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
