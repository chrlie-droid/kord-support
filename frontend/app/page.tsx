import { Shell } from '@/components/shell';

const stats = [
  { label: 'Новые заявки', value: '0', hint: 'ожидают реакции' },
  { label: 'Критические', value: '0', hint: 'нужны сразу' },
  { label: 'Объекты', value: '0', hint: 'в базе обслуживания' },
  { label: 'Клиенты', value: '0', hint: 'активная база' },
];

export default function DashboardPage() {
  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-slate-600">Главный экран показывает, что инженеру нужно сделать прямо сейчас.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-3 text-3xl font-bold">{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Рабочие сценарии 1.0</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>1. Найти клиента или объект.</li>
            <li>2. Открыть паспорт объекта.</li>
            <li>3. Создать или обработать заявку.</li>
            <li>4. Использовать базу знаний для типовых проблем.</li>
          </ul>
        </section>
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Фокус продукта</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Kord Support не будет монструозной ERP. Первая версия закрывает только CRM, Service Desk, паспорт объекта и базу знаний.
          </p>
        </section>
      </div>
    </Shell>
  );
}
