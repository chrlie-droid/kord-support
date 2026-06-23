import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ChatAutoRefresh } from '@/components/chat-auto-refresh';
import { ChatMessage } from '@/components/chat-message';
import { Shell } from '@/components/shell';
import { getTicket, getTicketComments, getVenue } from '@/lib/api';
import { sendOperatorMessageAction, uploadOperatorAttachmentAction } from './actions';
import { syncTicketToPyrusAction } from './pyrus-actions';

type PageProps = {
  params: Promise<{ ticketId: string }>;
};

const statusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting_client: 'Ждем клиента',
  resolved: 'Решена',
  closed: 'Закрыта',
};

export default async function OperatorTicketPage({ params }: PageProps) {
  const { ticketId } = await params;
  const id = Number(ticketId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const ticket = await getTicket(id);
  const [comments, venue] = await Promise.all([getTicketComments(id), getVenue(ticket.venue_id)]);
  const sendMessage = sendOperatorMessageAction.bind(null, id);
  const uploadAttachment = uploadOperatorAttachmentAction.bind(null, id);
  const syncPyrus = syncTicketToPyrusAction.bind(null, id);

  return (
    <Shell>
      <ChatAutoRefresh intervalMs={4000} />
      <Link href="/desk" className="text-sm text-slate-500 hover:text-slate-900">← Назад в Service Desk</Link>

      <div className="mt-4 grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Заявка №{ticket.id}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">{ticket.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{statusLabels[ticket.status] || ticket.status}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{ticket.priority}</span>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Pyrus</h2>
            <p className="mt-2 text-sm text-slate-600">{ticket.pyrus_task_id ? `Связана с задачей Pyrus №${ticket.pyrus_task_id}` : 'Пока не синхронизирована.'}</p>
            <form action={syncPyrus} className="mt-4">
              <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">Синхронизировать с Pyrus</button>
            </form>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Карточка инцидента</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-slate-500">Объект</dt><dd className="font-medium">{venue.name}</dd></div>
              <div><dt className="text-slate-500">Адрес</dt><dd className="font-medium">{venue.address || 'не указан'}</dd></div>
              <div><dt className="text-slate-500">Телефон</dt><dd className="font-medium">{venue.phone || 'не указан'}</dd></div>
              <div><dt className="text-slate-500">Режим работы</dt><dd className="font-medium">{venue.work_hours || 'не указан'}</dd></div>
            </dl>
            <Link href={`/objects/${venue.id}`} className="mt-4 inline-flex rounded-xl border px-3 py-2 text-sm text-slate-700">Открыть паспорт объекта</Link>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Описание</h2>
            <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{ticket.description}</p>
          </section>
        </aside>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Чат с клиентом</h2>
            <p className="mt-1 text-sm text-slate-500">автообновление каждые 4 секунды</p>
          </div>

          <div className="min-h-96 space-y-3 p-5">
            {comments.length === 0 ? <p className="text-sm text-slate-500">Сообщений пока нет.</p> : comments.map((comment) => <ChatMessage key={comment.id} authorName={comment.author_name} body={comment.body} />)}
          </div>

          <div className="border-t p-5">
            <form action={uploadAttachment} className="mb-3 flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 md:flex-row md:items-center">
              <input name="file" type="file" accept="image/*,.pdf" className="text-sm" required />
              <button className="rounded-xl border bg-white px-4 py-2 text-sm text-slate-700" type="submit">Загрузить фото/файл</button>
            </form>
            <form action={sendMessage}>
              <textarea name="body" className="min-h-28 w-full rounded-2xl border px-4 py-3" placeholder="Напишите ответ клиенту..." required />
              <div className="mt-3 flex justify-end">
                <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="submit">Отправить клиенту</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </Shell>
  );
}
