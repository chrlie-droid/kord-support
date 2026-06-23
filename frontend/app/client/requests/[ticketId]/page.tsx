import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClientShell } from '@/components/client-shell';
import { getTicket, getTicketComments } from '@/lib/api';
import { sendClientMessageAction } from './actions';

type PageProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function ClientTicketPage({ params }: PageProps) {
  const { ticketId } = await params;
  const id = Number(ticketId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const [ticket, comments] = await Promise.all([getTicket(id), getTicketComments(id)]);
  const sendMessage = sendClientMessageAction.bind(null, id);

  return (
    <ClientShell>
      <Link href="/client/requests" className="text-sm text-slate-500 hover:text-slate-900">← Мои обращения</Link>
      <section className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-300">Обращение №{ticket.id}</p>
          <h1 className="mt-1 text-2xl font-bold">{ticket.title}</h1>
          <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">{ticket.status}</div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="font-semibold">Карточка обращения</div>
            <dl className="mt-4 space-y-3">
              <div><dt className="text-slate-500">Объект ID</dt><dd className="font-medium">{ticket.venue_id}</dd></div>
              <div><dt className="text-slate-500">Приоритет</dt><dd className="font-medium">{ticket.priority}</dd></div>
              <div><dt className="text-slate-500">Статус</dt><dd className="font-medium">{ticket.status}</dd></div>
            </dl>
            <p className="mt-4 whitespace-pre-line rounded-xl bg-white p-3 text-xs text-slate-600">{ticket.description}</p>
          </aside>

          <div className="rounded-2xl border">
            <div className="border-b p-4">
              <div className="font-semibold">Чат с поддержкой</div>
              <div className="text-xs text-slate-500">сообщения сохраняются в базе и видны оператору</div>
            </div>
            <div className="space-y-3 p-4">
              {comments.length === 0 ? (
                <div className="text-sm text-slate-500">Сообщений пока нет.</div>
              ) : (
                comments.map((comment) => {
                  const isOperator = comment.author_name === 'Оператор';
                  return (
                    <div key={comment.id} className={`max-w-lg rounded-2xl p-3 text-sm ${isOperator ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <div className={`mb-1 text-xs font-semibold ${isOperator ? 'text-slate-300' : 'text-slate-500'}`}>{comment.author_name}</div>
                      <div className="whitespace-pre-line">{comment.body}</div>
                    </div>
                  );
                })
              )}
            </div>
            <form action={sendMessage} className="border-t p-4">
              <textarea name="body" className="min-h-24 w-full rounded-2xl border px-4 py-3" placeholder="Напишите ответ поддержке..." required />
              <button className="mt-3 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="submit">Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </ClientShell>
  );
}
