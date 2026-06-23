'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { categoryQuestions, demoClientObjects } from '@/lib/client-demo';
import { ticketCategories, type TicketCategoryKey } from '@/lib/ticket-categories';
import { createTicketFromWizardAction } from '@/app/client/help/wizard/actions';

type Step = 'object' | 'identity' | 'email' | 'category' | 'questions' | 'chat';

type Draft = {
  step: Step;
  objectId?: string;
  employeeName: string;
  employeeRole: string;
  employeePhone: string;
  employeeEmail: string;
  emailCode: string;
  emailVerified: boolean;
  deviceId: string;
  category?: TicketCategoryKey;
  answers: Record<string, string>;
  message: string;
};

const defaultDraft: Draft = {
  step: 'object',
  employeeName: '',
  employeeRole: '',
  employeePhone: '',
  employeeEmail: '',
  emailCode: '',
  emailVerified: false,
  deviceId: '',
  answers: {},
  message: '',
};

const storageKey = 'kord-support-client-request-draft-v3';
const identityStorageKey = 'kord-support-employee-identity-v2';
const demoEmailCode = '2026';

const steps: Array<{ key: Step; title: string }> = [
  { key: 'object', title: 'Объект' },
  { key: 'identity', title: 'Кто пишет' },
  { key: 'email', title: 'Email' },
  { key: 'category', title: 'Категория' },
  { key: 'questions', title: 'Уточнение' },
  { key: 'chat', title: 'Чат' },
];

function makeDeviceId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function RequestWizard() {
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    const savedIdentity = window.localStorage.getItem(identityStorageKey);
    let nextDraft = defaultDraft;

    if (raw) {
      try {
        nextDraft = { ...defaultDraft, ...JSON.parse(raw) };
      } catch {
        nextDraft = defaultDraft;
      }
    }

    if (savedIdentity) {
      try {
        const identity = JSON.parse(savedIdentity);
        nextDraft = { ...nextDraft, ...identity, emailCode: '' };
      } catch {
        // ignore broken identity cache
      }
    }

    if (!nextDraft.deviceId) {
      nextDraft = { ...nextDraft, deviceId: makeDeviceId() };
    }

    setDraft(nextDraft);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    if (draft.employeeName && draft.employeeEmail && draft.emailVerified) {
      window.localStorage.setItem(
        identityStorageKey,
        JSON.stringify({
          employeeName: draft.employeeName,
          employeeRole: draft.employeeRole,
          employeePhone: draft.employeePhone,
          employeeEmail: draft.employeeEmail,
          emailVerified: draft.emailVerified,
          deviceId: draft.deviceId,
        }),
      );
    }
  }, [draft, loaded]);

  const selectedObject = useMemo(() => demoClientObjects.find((item) => item.id === draft.objectId), [draft.objectId]);
  const selectedCategory = useMemo(() => ticketCategories.find((item) => item.key === draft.category), [draft.category]);
  const questions = draft.category ? categoryQuestions[draft.category] || [] : [];
  const activeIndex = steps.findIndex((item) => item.key === draft.step);
  const answerText = Object.entries(draft.answers).map(([, value]) => value).join(', ');
  const employeeTitle = [draft.employeeName, draft.employeeRole].filter(Boolean).join(' · ');

  function resetDraft() {
    window.localStorage.removeItem(storageKey);
    setDraft({ ...defaultDraft, deviceId: draft.deviceId || makeDeviceId() });
  }

  function resetIdentity() {
    window.localStorage.removeItem(identityStorageKey);
    setDraft({ ...draft, employeeName: '', employeeRole: '', employeePhone: '', employeeEmail: '', emailCode: '', emailVerified: false, step: 'identity' });
  }

  function verifyEmailCode() {
    if (draft.emailCode.trim() === demoEmailCode) {
      setDraft({ ...draft, emailVerified: true, step: 'category' });
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-6 gap-2">
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
          <p className="text-sm text-slate-500">Шаг 1 из 6</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Выберите объект</h1>
          <p className="mt-2 text-slate-600">QR-код на объекте в будущем будет выбирать ресторан автоматически.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {demoClientObjects.map((object) => (
              <button key={object.id} type="button" onClick={() => setDraft({ ...draft, objectId: object.id, step: 'identity' })} className="rounded-3xl border p-5 text-left shadow-sm transition hover:bg-slate-50">
                <div className="font-semibold">{object.name}</div>
                <p className="mt-2 text-sm text-slate-600">{object.address}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {draft.step === 'identity' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <button type="button" onClick={() => setDraft({ ...draft, step: 'object' })} className="text-sm text-slate-500 hover:text-slate-900">← Назад</button>
          <p className="mt-4 text-sm text-slate-500">Шаг 2 из 6 · {selectedObject?.name}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Представьтесь</h1>
          <p className="mt-2 text-slate-600">Нам важно точно знать, кто оставил обращение. Это не пароль и не сложная регистрация.</p>

          {draft.employeeName && draft.employeeEmail && draft.emailVerified ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Сейчас выбрано: <b>{employeeTitle}</b> · {draft.employeeEmail}{draft.employeePhone ? ` · ${draft.employeePhone}` : ''}
              <button type="button" onClick={resetIdentity} className="ml-3 underline">Это другой сотрудник</button>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Ваше имя *</span>
              <input value={draft.employeeName} onChange={(event) => setDraft({ ...draft, employeeName: event.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Например: Иван" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Должность</span>
              <input value={draft.employeeRole} onChange={(event) => setDraft({ ...draft, employeeRole: event.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Бармен, администратор, управляющий" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Телефон</span>
              <input value={draft.employeePhone} onChange={(event) => setDraft({ ...draft, employeePhone: event.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Чтобы инженер мог быстро уточнить детали" />
            </label>
          </div>

          <button type="button" disabled={!draft.employeeName.trim()} onClick={() => setDraft({ ...draft, step: draft.emailVerified ? 'category' : 'email' })} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-300">Продолжить</button>
        </section>
      ) : null}

      {draft.step === 'email' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <button type="button" onClick={() => setDraft({ ...draft, step: 'identity' })} className="text-sm text-slate-500 hover:text-slate-900">← Назад</button>
          <p className="mt-4 text-sm text-slate-500">Шаг 3 из 6 · {selectedObject?.name} · {employeeTitle}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Подтвердите email</h1>
          <p className="mt-2 text-slate-600">Email привяжет обращение к конкретному человеку. В MVP используем тестовый код <b>{demoEmailCode}</b>, позже подключим реальную отправку письма.</p>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Email *</span>
              <input value={draft.employeeEmail} onChange={(event) => setDraft({ ...draft, employeeEmail: event.target.value.toLowerCase(), emailVerified: false })} className="rounded-2xl border px-4 py-3" placeholder="name@example.ru" inputMode="email" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Код из письма *</span>
              <input value={draft.emailCode} onChange={(event) => setDraft({ ...draft, emailCode: event.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Для теста: 2026" inputMode="numeric" />
            </label>
          </div>

          <button type="button" disabled={!isValidEmail(draft.employeeEmail) || draft.emailCode.trim() !== demoEmailCode} onClick={verifyEmailCode} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-300">Подтвердить и продолжить</button>
        </section>
      ) : null}

      {draft.step === 'category' ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <button type="button" onClick={() => setDraft({ ...draft, step: 'email' })} className="text-sm text-slate-500 hover:text-slate-900">← Назад</button>
          <p className="mt-4 text-sm text-slate-500">Шаг 4 из 6 · {selectedObject?.name} · {employeeTitle} · {draft.employeeEmail}</p>
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
          <p className="mt-4 text-sm text-slate-500">Шаг 5 из 6 · {selectedObject?.name} · {selectedCategory?.title}</p>
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
            <h1 className="mt-2 text-2xl font-bold">Чат с инженером Kord</h1>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="font-semibold">Контекст обращения</div>
              <dl className="mt-4 space-y-3">
                <div><dt className="text-slate-500">Объект</dt><dd className="font-medium">{selectedObject?.name || 'Не выбран'}</dd></div>
                <div><dt className="text-slate-500">Автор</dt><dd className="font-medium">{employeeTitle || 'Не указан'}</dd></div>
                <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{draft.employeeEmail || 'Не указан'}</dd></div>
                {draft.employeePhone ? <div><dt className="text-slate-500">Телефон</dt><dd className="font-medium">{draft.employeePhone}</dd></div> : null}
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
                <div className="max-w-lg rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">Здравствуйте! Мы уже знаем объект и автора обращения. Опишите, что происходит, и приложите фото, если нужно.</div>
              </div>
              <form action={createTicketFromWizardAction} className="border-t p-4">
                <input type="hidden" name="venue_id" value={selectedObject?.venueId || 1} />
                <input type="hidden" name="object_name" value={selectedObject?.name || ''} />
                <input type="hidden" name="author_name" value={draft.employeeName} />
                <input type="hidden" name="author_role" value={draft.employeeRole} />
                <input type="hidden" name="author_phone" value={draft.employeePhone} />
                <input type="hidden" name="author_email" value={draft.employeeEmail} />
                <input type="hidden" name="author_email_verified" value={String(draft.emailVerified)} />
                <input type="hidden" name="author_device_id" value={draft.deviceId} />
                <input type="hidden" name="category_title" value={selectedCategory?.title || 'Обращение'} />
                <input type="hidden" name="answer" value={answerText} />
                <textarea name="message" value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} className="min-h-28 w-full rounded-2xl border px-4 py-3" placeholder="Напишите сообщение инженеру..." required />
                <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <button className="rounded-2xl border px-4 py-2 text-sm text-slate-600" type="button">Прикрепить фото</button>
                  <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="submit">Написать инженеру</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      <button type="button" onClick={resetDraft} className="text-sm text-slate-500 hover:text-slate-900">Сбросить черновик</button>
    </div>
  );
}
