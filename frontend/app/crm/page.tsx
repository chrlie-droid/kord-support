import { Shell } from '@/components/shell';

export default function CrmPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
      <p className="mt-2 text-slate-600">Клиенты, заведения, контакты и договоры.</p>
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">Здесь будет список клиентов и карточки заведений.</div>
    </Shell>
  );
}
