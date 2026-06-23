import Link from 'next/link';

import { ClientShell } from '@/components/client-shell';

export default function ClientHelpPage() {
  return (
    <ClientShell>
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-slate-500">Новый мастер обращения</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Создать обращение за 20 секунд</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Мастер сохранит черновик в браузере: можно вернуться назад, обновить страницу или продолжить позже.</p>
        <Link href="/client/help/wizard" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Запустить мастер</Link>
      </section>
    </ClientShell>
  );
}
