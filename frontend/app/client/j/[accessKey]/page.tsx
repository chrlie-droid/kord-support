import Link from 'next/link';

import { ClientShell } from '@/components/client-shell';
import { demoClientObjects } from '@/lib/client-demo';

type PageProps = {
  params: Promise<{ accessKey: string }>;
};

export default async function ObjectQrEntryPage({ params }: PageProps) {
  const { accessKey } = await params;
  const object = demoClientObjects[0];

  return (
    <ClientShell>
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-slate-500">QR-вход объекта</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Нужна помощь?</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          QR-код определил объект: <b>{object.name}</b>. Перед обращением сотрудник обязательно представится: имя, должность и телефон.
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Access key: <span className="font-mono">{accessKey}</span>. Позже этот ключ будет проверяться на сервере, и его можно будет перевыпустить в CRM.
        </div>
        <Link href="/client/help/wizard" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Написать инженеру</Link>
      </section>
    </ClientShell>
  );
}
