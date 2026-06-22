import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/shell';
import { getClient, getPassportSections, getVenue } from '@/lib/api';

type PageProps = {
  params: Promise<{ venueId: string }>;
};

const modules = [
  { key: 'iiko', title: 'iiko', description: 'Версия, лицензии, Front, Office, сервер и обновления.' },
  { key: 'equipment', title: 'Оборудование', description: 'Кассы, ФР, принтеры, терминалы, сканеры и весы.' },
  { key: 'egais', title: 'ЕГАИС', description: 'УТМ, RSA, FSRAR ID, порты и последняя синхронизация.' },
  { key: 'marking', title: 'Честный знак', description: 'ТС ПиОТ, GTIN, марки, режимы и особенности объекта.' },
  { key: 'network', title: 'Сеть', description: 'Роутер, провайдер, VPN, Wi-Fi, белый IP и удаленный доступ.' },
  { key: 'documents', title: 'Документы', description: 'Договоры, счета, акты, фото оборудования и файлы.' },
];

function statusLabel(status: string) {
  if (status === 'ok') return 'заполнено';
  if (status === 'needs_attention') return 'требует внимания';
  if (status === 'missing') return 'нет данных';
  return 'черновик';
}

export default async function ObjectDetailPage({ params }: PageProps) {
  const { venueId } = await params;
  const id = Number(venueId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const [venue, sections] = await Promise.all([getVenue(id), getPassportSections(id)]);
  const client = await getClient(venue.client_id);
  const sectionsByKey = new Map(sections.map((section) => [section.module_key, section]));
  const filledCount = sections.filter((section) => section.status === 'ok').length;

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
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Паспорт</div><div className="mt-2 text-lg font-semibold">{filledCount}/{modules.length}</div></div>
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
          {modules.map((module) => {
            const section = sectionsByKey.get(module.key);
            return (
              <div key={module.key} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-lg font-semibold">{module.title}</div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{statusLabel(section?.status || 'draft')}</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section?.summary || module.description}</p>
                {section?.notes ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{section.notes}</p> : null}
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
