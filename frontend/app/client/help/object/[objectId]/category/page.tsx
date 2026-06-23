import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClientShell } from '@/components/client-shell';
import { demoClientObjects } from '@/lib/client-demo';
import { ticketCategories } from '@/lib/ticket-categories';

type PageProps = {
  params: Promise<{ objectId: string }>;
};

export default async function ClientHelpObjectCategoryPage({ params }: PageProps) {
  const { objectId } = await params;
  const object = demoClientObjects.find((item) => item.id === objectId);

  if (!object) {
    notFound();
  }

  return (
    <ClientShell>
      <Link href="/client/help/object" className="text-sm text-slate-500 hover:text-slate-900">← Назад к объектам</Link>
      <div className="mb-6 mt-4">
        <p className="text-sm text-slate-500">Шаг 2 из 4 · {object.name}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Что произошло?</h1>
        <p className="mt-2 text-slate-600">Выберите похожую категорию. Срочность выбирать не нужно.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ticketCategories.map((category) => (
          <Link key={category.key} href={`/client/help/object/${object.id}/category/${category.key}/questions`} className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="font-semibold">{category.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.examples.slice(0, 3).map((example) => (
                <span key={example} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{example}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </ClientShell>
  );
}
