'use client';

import { useActionState } from 'react';

import { saveEmailSettingsAction, testEmailSettingsAction, type SettingsActionState } from '@/app/settings/actions';

type EmailSettings = {
  email_provider: string;
  email_from?: string | null;
  resend_api_key_set: boolean;
  resend_api_key_masked?: string | null;
  smtp_enabled: boolean;
  smtp_host?: string | null;
  smtp_port: number;
  smtp_username?: string | null;
  smtp_password_set: boolean;
  smtp_password_masked?: string | null;
  smtp_from?: string | null;
  smtp_starttls: boolean;
  smtp_ssl: boolean;
};

const initialState: SettingsActionState = { ok: true, message: '' };

function StatusBox({ state }: { state: SettingsActionState }) {
  if (!state.message) return null;
  return <div className={`rounded-2xl p-4 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{state.message}</div>;
}

export function SettingsEmailForm({ settings }: { settings: EmailSettings }) {
  const [saveState, saveAction, savePending] = useActionState(saveEmailSettingsAction, initialState);
  const [testState, testAction, testPending] = useActionState(testEmailSettingsAction, initialState);

  return (
    <>
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Email-провайдер</h2>
            <p className="mt-1 text-sm text-slate-500">Текущий канал: {settings.email_provider || 'smtp'} · Resend API key {settings.resend_api_key_set ? `задан (${settings.resend_api_key_masked})` : 'не задан'}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{settings.email_provider || 'smtp'}</span>
        </div>

        <form action={saveAction} className="mt-6 grid gap-5">
          <StatusBox state={saveState} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Основной канал</span>
              <select name="email_provider" defaultValue={settings.email_provider || 'smtp'} className="rounded-2xl border px-4 py-3">
                <option value="smtp">SMTP / fallback logs</option>
                <option value="resend">Resend API</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Email отправителя</span>
              <input name="email_from" defaultValue={settings.email_from || settings.smtp_from || ''} className="rounded-2xl border px-4 py-3" placeholder="Kord Support <noreply@koard.ru>" />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium">Resend API key</span>
              <input name="resend_api_key" type="password" className="rounded-2xl border px-4 py-3" placeholder={settings.resend_api_key_set ? 'Оставьте пустым, чтобы не менять' : 're_...'} />
            </label>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
            Resend работает через HTTPS 443, поэтому не зависит от заблокированных SMTP-портов 465/587 на VDS.
          </div>

          <div className="border-t pt-5">
            <h3 className="font-semibold">SMTP резерв</h3>
            <p className="mt-1 text-sm text-slate-500">Можно оставить для будущего, но сейчас Timeweb SMTP с VDS недоступен.</p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium">
            <input name="smtp_enabled" type="checkbox" defaultChecked={settings.smtp_enabled} />
            Включить SMTP
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">SMTP host</span>
              <input name="smtp_host" defaultValue={settings.smtp_host || ''} className="rounded-2xl border px-4 py-3" placeholder="smtp.timeweb.ru" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">SMTP port</span>
              <input name="smtp_port" type="number" defaultValue={settings.smtp_port || 587} className="rounded-2xl border px-4 py-3" placeholder="465" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">SMTP логин</span>
              <input name="smtp_username" defaultValue={settings.smtp_username || ''} className="rounded-2xl border px-4 py-3" placeholder="noreply@koard.ru" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">SMTP From</span>
              <input name="smtp_from" defaultValue={settings.smtp_from || ''} className="rounded-2xl border px-4 py-3" placeholder="noreply@koard.ru" />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium">SMTP пароль</span>
              <input name="smtp_password" type="password" className="rounded-2xl border px-4 py-3" placeholder={settings.smtp_password_set ? 'Оставьте пустым, чтобы не менять' : 'Пароль от почтового ящика'} />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium">
              <input name="smtp_ssl" type="checkbox" defaultChecked={settings.smtp_ssl} />
              SSL / implicit TLS, обычно порт 465
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium">
              <input name="smtp_starttls" type="checkbox" defaultChecked={settings.smtp_starttls} />
              STARTTLS, обычно порт 587
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            {savePending ? <span className="text-sm text-slate-500">Сохраняем...</span> : null}
            <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:bg-slate-300" disabled={savePending} type="submit">
              {savePending ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Тест отправки</h2>
        <p className="mt-1 text-sm text-slate-500">Отправит тестовый код 123456 через выбранный канал. Если канал не настроен, код будет записан в логи.</p>
        <form action={testAction} className="mt-5 grid gap-4">
          <StatusBox state={testState} />
          <div className="flex flex-col gap-3 md:flex-row">
            <input name="test_email" className="flex-1 rounded-2xl border px-4 py-3" placeholder="email для теста" />
            <button className="rounded-2xl border px-5 py-3 font-semibold text-slate-700 disabled:bg-slate-100" disabled={testPending} type="submit">
              {testPending ? 'Отправляем...' : 'Отправить тест'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
