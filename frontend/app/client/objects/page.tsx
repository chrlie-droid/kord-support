import { ClientShell } from '@/components/client-shell';

export default function ClientObjectsPage() {
  return (
    <ClientShell>
      <h1 className="text-3xl font-bold tracking-tight">Мои объекты</h1>
      <p className="mt-2 text-slate-600">Здесь клиент будет выбирать заведение перед созданием обращения.</p>
      <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Тестовое заведение</h2>
        <p className="mt-2 text-sm text-slate-600">Демо-карточка объекта для проверки клиентского сценария.</p>
      </section>
    </ClientShell>
  );
}
