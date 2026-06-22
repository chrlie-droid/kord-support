import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/shell';
import { getClient, getVenue } from '@/lib/api';

type PageProps = {
  params: Promise<{ venueId: string }>;
};

const modules = [
  { title: 'iiko', description: 'Версия, лицензии, Front, Office, сервер и обновления.' },
  { title: 'Оборудование', description: 'Кассы, ФР, принтеры, терминалы, сканеры и весы.' },
  { title: 'ЕГАИС', description: 'УТМ, RSA, FSRAR ID, порты и последняя синхронизация.' },
  { title: 'Честный знак', description: 'ТС ПиОТ, GTIN, марки, режимы и особенности объекта.' },
  { title: 'Сеть', description: 'Роутер, провайдер, VPN, Wi-Fi, белый IP и удаленный доступ.' },
  { title: 'Документы', description: 'Договоры, счета, акты, фото оборудования и файлы.' },
];

export default async function ObjectDetailPage({ params }: PageProps) {
  const { venueId } = await params;
  const id = Number(venueId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const venue = await getVenue(id);
  const client = await getClient(venue.client_id);

  return (
    <Shell>
      <div className="mb-6">
        <Link href={`/crm/${client.id}`} className="text-sm text-slate-500 hover:text-slate-900">← Назад к клиенту</Link>
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
            <p className="mt-2 text-slate-600">Паспорт объекта · {client.name}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{venue.venue_type}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Статус</div><div className="mt-2 text-lg font-semibold">В работе</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Заявки</div><div className="mt-2 text-3xl font-bold">0</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Мониторинг</div><div className="mt-2 text-lg font-semibold">Не подключен</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Паспорт</div><div className="mt-2 text-lg font-semibold">Черновик</div></div>
      </div>

      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Общие сведения</h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Клиент</dt><dd className="mt-1 font-medium">{client.name}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Адрес</dt><dd className="mt-1 font-medium">{venue.address || 'не указан'}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Телефон</dt><dd className="mt-1 font-medium">{venue.phone || 'не указан'}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Режим работы</dt><dd className="mt-1 font-medium">{venue.work_hours || 'не указан'}</dd></div>
        </dl>
        {venue.notes ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{venue.notes}</p> : null}
      </section>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Разделы паспорта объекта</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div key={module.title} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-lg font-semibold">{module.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
              <div className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">будет в 0.5</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
