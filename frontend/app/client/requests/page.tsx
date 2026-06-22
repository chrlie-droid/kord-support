import Link from 'next/link';
import { ClientShell } from '@/components/client-shell';

export default function ClientRequestsPage() {
  return (
    <ClientShell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои обращения</h1>
          <p className="mt-2 text-slate-600">Здесь будут только ваши личные заявки и чаты с поддержкой.</p>
        </div>
        <Link href="/client/help" className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Нужна помощь</Link>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Обращений пока нет</h2>
        <p className="mt-2 text-sm text-slate-600">После создания обращения оно появится здесь. Чужие обращения в этом разделе не отображаются.</p>
      </section>
    </ClientShell>
  );
}
