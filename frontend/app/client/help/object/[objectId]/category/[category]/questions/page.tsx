import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClientShell } from '@/components/client-shell';
import { categoryQuestions, demoClientObjects } from '@/lib/client-demo';
import { ticketCategories } from '@/lib/ticket-categories';

type PageProps = {
  params: Promise<{ objectId: string; category: string }>;
};

export default async function ClientHelpQuestionsPage({ params }: PageProps) {
  const { objectId, category } = await params;
  const object = demoClientObjects.find((item) => item.id === objectId);
  const selected = ticketCategories.find((item) => item.key === category);

  if (!object || !selected) {
    notFound();
  }

  const questions = categoryQuestions[category] || [];
  const firstAnswer = questions[0]?.options[0] || 'Не указано';

  return (
    <ClientShell>
      <Link href={`/client/help/object/${object.id}/category`} className="text-sm text-slate-500 hover:text-slate-900">← Назад к категориям</Link>
      <section className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Шаг 3 из 4 · {object.name} · {selected.title}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Уточним пару деталей</h1>
        <p className="mt-3 text-slate-600">Это поможет инженеру сразу понять контекст и не задавать лишние вопросы.</p>

        <div className="mt-6 grid gap-5">
          {questions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Для этой категории пока нет уточняющих вопросов.</div>
          ) : (
            questions.map((question) => (
              <div key={question.id}>
                <div className="font-semibold">{question.title}</div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm hover:bg-slate-50">
                      <input type="radio" name={question.id} defaultChecked={option === question.options[0]} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <Link href={`/client/help/object/${object.id}/category/${selected.key}/chat?answer=${encodeURIComponent(firstAnswer)}`} className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Продолжить к чату</Link>
      </section>
    </ClientShell>
  );
}
