import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClientShell } from '@/components/client-shell';
import { demoClientObjects } from '@/lib/client-demo';
import { ticketCategories } from '@/lib/ticket-categories';

type PageProps = {
  params: Promise<{ objectId: string; category: string }>;
  searchParams: Promise<{ answer?: string }>;
};

export default async function ClientHelpChatPreviewPage({ params, searchParams }: PageProps) {
  const { objectId, category } = await params;
  const { answer } = await searchParams;
  const object = demoClientObjects.find((item) => item.id === objectId);
  const selected = ticketCategories.find((item) => item.key === category);

  if (!object || !selected) {
    notFound();
  }

  return (
    <ClientShell>
      <Link href={`/client/help/object/${object.id}/category/${selected.key}/questions`} className="text-sm text-slate-500 hover:text-slate-900">← Назад к вопросам</Link>

      <section className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-300">Шаг 4 из 4</p>
          <h1 className="mt-1 text-2xl font-bold">Чат с поддержкой</h1>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="font-semibold">Контекст обращения</div>
            <dl className="mt-4 space-y-3">
              <div><dt className="text-slate-500">Объект</dt><dd className="font-medium">{object.name}</dd></div>
              <div><dt className="text-slate-500">Категория</dt><dd className="font-medium">{selected.title}</dd></div>
              <div><dt className="text-slate-500">Уточнение</dt><dd className="font-medium">{answer || 'Не указано'}</dd></div>
            </dl>
          </aside>

          <div className="rounded-2xl border">
            <div className="border-b p-4">
              <div className="font-semibold">Поддержка Kord</div>
              <div className="text-xs text-slate-500">обращение будет создано автоматически после первого сообщения</div>
            </div>
            <div className="space-y-3 p-4">
              <div className="max-w-lg rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
                Здравствуйте! Мы уже знаем объект и категорию проблемы. Опишите, что происходит, и приложите фото, если нужно.
              </div>
            </div>
            <div className="border-t p-4">
              <textarea className="min-h-28 w-full rounded-2xl border px-4 py-3" placeholder="Напишите сообщение инженеру..." />
              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <button className="rounded-2xl border px-4 py-2 text-sm text-slate-600" type="button">Прикрепить фото</button>
                <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="button">Отправить и создать обращение</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientShell>
  );
}
