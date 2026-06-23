'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { categoryQuestions, demoClientObjects } from '@/lib/client-demo';
import { ticketCategories, type TicketCategoryKey } from '@/lib/ticket-categories';

type Step = 'object' | 'category' | 'questions' | 'chat';

type Draft = {
  step: Step;
  objectId?: string;
  category?: TicketCategoryKey;
  answers: Record<string, string>;
  message: string;
};

const defaultDraft: Draft = {
  step: 'object',
  answers: {},
  message: '',
};

const storageKey = 'kord-support-client-request-draft-v1';

const steps: Array<{ key: Step; title: string }> = [
  { key: 'object', title: 'Объект' },
  { key: 'category', title: 'Категория' },
  { key: 'questions', title: 'Уточнение' },
  { key: 'chat', title: 'Чат' },
];

export function RequestWizard() {
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setDraft({ ...defaultDraft, ...JSON.parse(raw) });
      } catch {
        setDraft(defaultDraft);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, loaded]);

  const selectedObject = useMemo(() => demoClientObjects.find((item) => item.id === draft.objectId), [draft.objectId]);
  const selectedCategory = useMemo(() => ticketCategories.find((item) => item.key === draft.category), [draft.category]);
  const questions = draft.category ? categoryQuestions[draft.category] || [] : [];
  const activeIndex = steps.findIndex((item) => item.key === draft.step);

  function resetDraft() {
    window.localStorage.removeItem(storageKey);
    setDraft(defaultDraft);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${index <= activeIndex ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {index < activeIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <div className="hidden text-sm font-medium text-slate-700 md:block">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {draft.step === 'object' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Шаг 1 из 4</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Выберите объект</h1>
          <p className="mt-2 text-slate-600">Так инженер сразу поймет, где нужна помощь.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {demoClientObjects.map((object) => (
              <button key={object.id} type="button" onClick={() => setDraft({ ...draft, objectId: object.id, step: 'category' })} className="rounded-3xl border p-5 text-left shadow-sm transition hover:bg-slate-50">
                <div className="font-semibold">{object.name}</div>
                <p className="mt-2 text-sm text-slate-600">{object.address}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {draft.step === 'category' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <button type="button" onClick={() => setDraft({ ...draft, step: 'object' })} className="text-sm text-slate-500 hover:text-slate-900">← Назад</button>
          <p className="mt-4 text-sm text-slate-500">Шаг 2 из 4 · {selectedObject?.name}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Что произошло?</h1>
          <p className="mt-2 text-slate-600">Выберите похожую категорию. Срочность выбирать не нужно.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ticketCategories.map((category) => (
              <button key={category.key} type="button" onClick={() => setDraft({ ...draft, category: category.key, answers: {}, step: 'questions' })} className="rounded-3xl border p-5 text-left shadow-sm transition hover:bg-slate-50">
                <div className="font-semibold">{category.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {draft.step === 'questions' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <button type="button" onClick={() => setDraft({ ...draft, step: 'category' })} className="text-sm text-slate-500 hover:text-slate-900">← Назад</button>
          <p className="mt-4 text-sm text-slate-500">Шаг 3 из 4 · {selectedObject?.name} · {selectedCategory?.title}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Уточним детали</h1>
          <div className="mt-6 space-y-5">
            {questions.map((question) => (
              <div key={question.id}>
                <div className="font-semibold">{question.title}</div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = draft.answers[question.id] === option;
                    return (
                      <button key={option} type="button" onClick={() => setDraft({ ...draft, answers: { ...draft.answers, [question.id]: option } })} className={`rounded-2xl border px-4 py-3 text-left text-sm ${selected ? 'border-slate-950 bg-slate-950 text-white' : 'hover:bg-slate-50'}`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {questions.length === 0 ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Для этой категории пока нет уточняющих вопросов.</div> : null}
          </div>
          <button type="button" onClick={() => setDraft({ ...draft, step: 'chat' })} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">Продолжить к чату</button>
        </section>
      ) : null}

      {draft.step === 'chat' ? (
        <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="border-b bg-slate-950 p-5 text-white">
            <button type="button" onClick={() => setDraft({ ...draft, step: 'questions' })} className="text-sm text-slate-300 hover:text-white">← Назад</button>
            <h1 className="mt-2 text-2xl font-bold">Чат с поддержкой</h1>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="font-semibold">Контекст обращения</div>
              <dl className="mt-4 space-y-3">
                <div><dt className="text-slate-500">Объект</dt><dd className="font-medium">{selectedObject?.name || 'Не выбран'}</dd></div>
                <div><dt className="text-slate-500">Категория</dt><dd className="font-medium">{selectedCategory?.title || 'Не выбрана'}</dd></div>
                {Object.entries(draft.answers).map(([key, value]) => <div key={key}><dt className="text-slate-500">Уточнение</dt><dd className="font-medium">{value}</dd></div>)}
              </dl>
            </aside>
            <div className="rounded-2xl border">
              <div className="border-b p-4">
                <div className="font-semibold">Поддержка Kord</div>
                <div className="text-xs text-slate-500">обращение будет создано после первого сообщения</div>
              </div>
              <div className="space-y-3 p-4">
                <div className="max-w-lg rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">Здравствуйте! Мы уже собрали контекст. Опишите, что происходит, и приложите фото, если нужно.</div>
              </div>
              <div className="border-t p-4">
                <textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} className="min-h-28 w-full rounded-2xl border px-4 py-3" placeholder="Напишите сообщение инженеру..." />
                <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <button className="rounded-2xl border px-4 py-2 text-sm text-slate-600" type="button">Прикрепить фото</button>
                  <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="button">Отправить и создать обращение</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <button type="button" onClick={resetDraft} className="text-sm text-slate-500 hover:text-slate-900">Сбросить черновик</button>
    </div>
  );
}
