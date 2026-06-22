import { Shell } from '@/components/shell';
import { getClients, getContacts, getVenues } from '@/lib/api';

export default async function CrmPage() {
  const [clients, venues, contacts] = await Promise.all([getClients(), getVenues(), getContacts()]);

  const venuesByClient = new Map<number, number>();
  const contactsByClient = new Map<number, number>();

  for (const venue of venues) {
    venuesByClient.set(venue.client_id, (venuesByClient.get(venue.client_id) || 0) + 1);
  }

  for (const contact of contacts) {
    contactsByClient.set(contact.client_id, (contactsByClient.get(contact.client_id) || 0) + 1);
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="mt-2 text-slate-600">Клиенты, заведения, контакты и договоры.</p>
        </div>
        <div className="rounded-2xl border bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          {clients.length} клиентов · {venues.length} заведений · {contacts.length} контактов
        </div>
      </div>

      {clients.length === 0 ? (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Клиентов пока нет</h2>
          <p className="mt-2 text-sm text-slate-600">Следующим шагом добавим форму создания клиента прямо в новый интерфейс.</p>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {clients.map((client) => (
            <article key={client.id} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{client.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">ИНН: {client.inn || 'не указан'}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{client.support_plan || 'без тарифа'}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{venuesByClient.get(client.id) || 0}</div>
                  <div className="text-xs text-slate-500">заведений</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{contactsByClient.get(client.id) || 0}</div>
                  <div className="text-xs text-slate-500">контактов</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-slate-500">заявок</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">Договор: {client.contract_number || 'не указан'}</div>
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}
