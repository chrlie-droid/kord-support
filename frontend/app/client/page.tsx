import { Shell } from '@/components/shell';
import { ticketCategories } from '@/lib/ticket-categories';

export default function ClientPortalPage() {
  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Клиентский портал</h1>
        <p className="mt-2 text-slate-600">Главный сценарий: выбрать объект, выбрать категорию проблемы и начать чат с поддержкой.</p>
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Что произошло?</h2>
        <p className="mt-2 text-sm text-slate-600">Клиент не выбирает срочность. Он выбирает понятную категорию, а система определяет маршрут обработки.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ticketCategories.map((category) => (
            <div key={category.key} className="rounded-2xl border p-4 transition hover:bg-slate-50">
              <div className="font-semibold">{category.title}</div>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.examples.slice(0, 2).map((example) => (
                  <span key={example} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{example}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
