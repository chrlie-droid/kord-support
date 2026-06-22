import Link from 'next/link';

import { ClientShell } from '@/components/client-shell';
import { ticketCategories } from '@/lib/ticket-categories';

export default function ClientHelpPage() {
  return (
    <ClientShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Что произошло?</h1>
        <p className="mt-2 text-slate-600">Выберите похожую категорию. Срочность выбирать не нужно — ее определит поддержка.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ticketCategories.map((category) => (
          <Link key={category.key} href={`/client/help/${category.key}`} className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
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
