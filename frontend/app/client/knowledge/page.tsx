import { ClientShell } from '@/components/client-shell';

export default function ClientKnowledgePage() {
  return (
    <ClientShell>
      <h1 className="text-3xl font-bold tracking-tight">Инструкции</h1>
      <p className="mt-2 text-slate-600">Короткие ответы на частые вопросы клиента.</p>
      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {['Как закрыть смену', 'Что делать если не печатает чек', 'Как перезапустить кассу'].map((item) => (
          <div key={item} className="rounded-3xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-slate-600">Черновик будущей статьи базы знаний.</p>
          </div>
        ))}
      </section>
    </ClientShell>
  );
}
