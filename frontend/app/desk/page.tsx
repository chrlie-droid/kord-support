import { Shell } from '@/components/shell';

export default function DeskPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">Service Desk</h1>
      <p className="mt-2 text-slate-600">Заявки, комментарии, статусы и Pyrus-синхронизация.</p>
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">Здесь будет рабочая очередь заявок.</div>
    </Shell>
  );
}
