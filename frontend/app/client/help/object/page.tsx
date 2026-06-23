import Link from 'next/link';

import { ClientShell } from '@/components/client-shell';
import { demoClientObjects } from '@/lib/client-demo';

export default function ClientHelpObjectPage() {
  return (
    <ClientShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Выберите объект</h1>
        <p className="mt-2 text-slate-600">Так инженер сразу поймет, где нужна помощь.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {demoClientObjects.map((object) => (
          <Link key={object.id} href={`/client/help/object/${object.id}/category`} className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="font-semibold">{object.name}</div>
            <p className="mt-2 text-sm text-slate-600">{object.address}</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">активен</span>
          </Link>
        ))}
      </div>
    </ClientShell>
  );
}
