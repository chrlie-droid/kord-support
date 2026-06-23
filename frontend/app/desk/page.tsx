import Link from 'next/link';

import { Shell } from '@/components/shell';
import { getTickets } from '@/lib/api';

const statusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting_client: 'Ждем клиента',
  resolved: 'Решена',
  closed: 'Закрыта',
};

export default async function DeskPage() {
  const tickets = await getTickets();
  const newCount = tickets.filter((ticket) => ticket.status === 'new').length;
  const inWorkCount = tickets.filter((ticket) => ticket.status === 'in_progress').length;
  const waitingCount = tickets.filter((ticket) => ticket.status === 'waiting_client').length;

  return (
    <Shell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Desk</h1>
          <p className="mt-2 text-slate-600">Рабочая очередь оператора: все обращения, созданные клиентами через портал.</p>
        </div>
        <div className="rounded-2xl border bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          {tickets.length} всего · {newCount} новых · {inWorkCount} в работе · {waitingCount} ждут клиента
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Новые</div><div className="mt-2 text-3xl font-bold">{newCount}</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">В работе</div><div className="mt-2 text-3xl font-bold">{inWorkCount}</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Ждут клиента</div><div className="mt-2 text-3xl font-bold">{waitingCount}</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Очередь</div><div className="mt-2 text-3xl font-bold">{tickets.length}</div></div>
      </div>

      {tickets.length === 0 ? (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Заявок пока нет</h2>
          <p className="mt-2 text-sm text-slate-600">Создай обращение через клиентский мастер, и оно появится здесь.</p>
        </section>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/desk/${ticket.id}`} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <div className="text-sm text-slate-500">Заявка №{ticket.id} · объект ID {ticket.venue_id}</div>
                  <h2 className="mt-1 text-lg font-semibold">{ticket.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{statusLabels[ticket.status] || ticket.status}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{ticket.priority}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}
