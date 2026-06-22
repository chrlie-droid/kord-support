import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClientShell } from '@/components/client-shell';
import { ticketCategories } from '@/lib/ticket-categories';

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function ClientHelpCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const selected = ticketCategories.find((item) => item.key === category);

  if (!selected) {
    notFound();
  }

  return (
    <ClientShell>
      <Link href="/client/help" className="text-sm text-slate-500 hover:text-slate-900">← Назад к категориям</Link>

      <section className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Новое обращение</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{selected.title}</h1>
        <p className="mt-3 text-slate-600">{selected.description}</p>

        <form className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Объект</span>
            <select className="rounded-2xl border px-4 py-3" defaultValue="demo">
              <option value="demo">Тестовое заведение</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Кратко опишите проблему</span>
            <input className="rounded-2xl border px-4 py-3" placeholder={selected.examples[0] || 'Что произошло?'} />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Комментарий</span>
            <textarea className="min-h-32 rounded-2xl border px-4 py-3" placeholder="Напишите детали. После отправки откроется чат с инженером." />
          </label>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            В MVP эта форма пока является экраном-подготовкой. Следующим шагом подключим создание обращения и чат.
          </div>

          <button type="button" className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white md:w-fit">Начать чат с поддержкой</button>
        </form>
      </section>
    </ClientShell>
  );
}
