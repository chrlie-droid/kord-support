import Link from 'next/link';
import { BookOpen, LifeBuoy, MessageCircle, Store } from 'lucide-react';

import { ClientShell } from '@/components/client-shell';

const actions = [
  { href: '/client/help', title: 'Нужна помощь', description: 'Выберите объект и категорию проблемы. Дальше откроется чат с поддержкой.', icon: LifeBuoy },
  { href: '/client/requests', title: 'Мои обращения', description: 'Только ваши заявки и переписки. Чужие обращения не отображаются.', icon: MessageCircle },
  { href: '/client/objects', title: 'Мои объекты', description: 'Заведения, к которым у вас есть доступ.', icon: Store },
  { href: '/client/knowledge', title: 'Инструкции', description: 'Короткие ответы на частые вопросы.', icon: BookOpen },
];

export default function ClientPortalPage() {
  return (
    <ClientShell>
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="max-w-2xl">
          <p className="text-sm text-slate-300">Клиентский портал</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Поддержка без Telegram-хаоса</h1>
          <p className="mt-4 text-slate-300">Создайте обращение через понятные категории, общайтесь с инженером в чате и видьте только свои заявки.</p>
          <Link href="/client/help" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Нужна помощь</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5" /></div>
                <div>
                  <h2 className="font-semibold">{action.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </ClientShell>
  );
}
