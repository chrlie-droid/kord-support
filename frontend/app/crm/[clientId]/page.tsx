import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/shell';
import { getClient, getClientContacts, getClientVenues } from '@/lib/api';
import { createVenueAction } from './actions';

type PageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientDetailPage({ params }: PageProps) {
  const { clientId } = await params;
  const id = Number(clientId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const [client, venues, contacts] = await Promise.all([getClient(id), getClientVenues(id), getClientContacts(id)]);
  const createVenue = createVenueAction.bind(null, id);

  return (
    <Shell>
      <div className="mb-6">
        <Link href="/crm" className="text-sm text-slate-500 hover:text-slate-900">← Назад в CRM</Link>
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="mt-2 text-slate-600">Карточка клиента: общие сведения, заведения и контакты.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{client.support_plan || 'без тарифа'}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Заведения</div><div className="mt-2 text-3xl font-bold">{venues.length}</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Контакты</div><div className="mt-2 text-3xl font-bold">{contacts.length}</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Заявки</div><div className="mt-2 text-3xl font-bold">0</div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Статус</div><div className="mt-2 text-lg font-semibold">Активный</div></div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Общие сведения</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">ИНН</dt><dd>{client.inn || 'не указан'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">КПП</dt><dd>{client.kpp || 'не указан'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Договор</dt><dd>{client.contract_number || 'не указан'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Тариф</dt><dd>{client.support_plan || 'не указан'}</dd></div>
          </dl>
          {client.notes ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{client.notes}</p> : null}
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Новое заведение</h2>
          <form action={createVenue} className="mt-4 grid gap-3">
            <input name="name" required placeholder="Название заведения" className="rounded-xl border px-3 py-2" />
            <select name="venue_type" className="rounded-xl border px-3 py-2" defaultValue="other">
              <option value="bar">Бар</option>
              <option value="cafe">Кафе</option>
              <option value="restaurant">Ресторан</option>
              <option value="dark_kitchen">Dark Kitchen</option>
              <option value="food_truck">Фудтрак</option>
              <option value="other">Другое</option>
            </select>
            <input name="address" placeholder="Адрес" className="rounded-xl border px-3 py-2" />
            <input name="phone" placeholder="Телефон" className="rounded-xl border px-3 py-2" />
            <input name="work_hours" placeholder="Режим работы" className="rounded-xl border px-3 py-2" />
            <textarea name="notes" placeholder="Заметки" className="rounded-xl border px-3 py-2" />
            <button className="rounded-xl bg-slate-950 px-4 py-2 text-white md:w-fit">Создать заведение</button>
          </form>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Заведения</h2><span className="text-sm text-slate-500">{venues.length}</span></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {venues.length === 0 ? <p className="text-sm text-slate-500">Заведений пока нет.</p> : venues.map((venue) => (
            <Link key={venue.id} href={`/objects/${venue.id}`} className="block rounded-xl border p-3 transition hover:bg-slate-50">
              <div className="font-medium">{venue.name}</div>
              <div className="mt-1 text-sm text-slate-500">{venue.address || 'адрес не указан'}</div>
              <div className="mt-1 text-xs text-slate-400">{venue.venue_type}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Контакты</h2><span className="text-sm text-slate-500">{contacts.length}</span></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {contacts.length === 0 ? <p className="text-sm text-slate-500">Контактов пока нет.</p> : contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border p-3">
              <div className="font-medium">{contact.full_name}</div>
              <div className="mt-1 text-sm text-slate-500">{contact.role || 'роль не указана'}</div>
              <div className="mt-2 text-sm text-slate-600">{contact.phone || contact.email || 'контакты не указаны'}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
