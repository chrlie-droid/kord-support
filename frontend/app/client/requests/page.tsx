import Link from 'next/link';

import { ClientShell } from '@/components/client-shell';
import { getTickets } from '@/lib/api';

export default async function ClientRequestsPage() {
  const tickets = await getTickets();

  return (
    <ClientShell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои обращения</h1>
          <p className="mt-2 text-slate-600">MVP показывает созданные обращения. После авторизации здесь останутся только личные заявки аккаунта.</p>
        </div>
        <Link href="/client/help/wizard" className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Нужна помощь</Link>
      </div>

      {tickets.length === 0 ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Обращений пока нет</h2>
          <p className="mt-2 text-sm text-slate-600">После создания обращения оно появится здесь.</p>
        </section>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/client/requests/${ticket.id}`} className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <div className="text-sm text-slate-500">Обращение №{ticket.id}</div>
                  <h2 className="mt-1 text-lg font-semibold">{ticket.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{ticket.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ClientShell>
  );
}
