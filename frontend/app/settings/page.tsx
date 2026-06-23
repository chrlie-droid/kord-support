import { Shell } from '@/components/shell';
import { saveEmailSettingsAction, testEmailSettingsAction } from './actions';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

type EmailSettings = {
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

async function getEmailSettings(): Promise<EmailSettings> {
  const response = await fetch(`${API_BASE_URL}/admin/email-settings`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить настройки почты');
  }

  return response.json();
}

export default async function SettingsPage() {
  const settings = await getEmailSettings();

  return (
    <Shell>
      <div className="max-w-5xl space-y-6">
        <div>
          <p className="text-sm text-slate-500">Администрирование</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Настройки</h1>
          <p className="mt-2 text-slate-600">Почта используется для подтверждения входа клиента по email и будущих уведомлений.</p>
        </div>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">SMTP-почта</h2>
              <p className="mt-1 text-sm text-slate-500">Текущий статус: {settings.smtp_enabled ? 'включена' : 'выключена'} · пароль {settings.smtp_password_set ? `задан (${settings.smtp_password_masked})` : 'не задан'}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm ${settings.smtp_enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {settings.smtp_enabled ? 'Активно' : 'Отключено'}
            </span>
          </div>

          <form action={saveEmailSettingsAction} className="mt-6 grid gap-5">
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium">
              <input name="smtp_enabled" type="checkbox" defaultChecked={settings.smtp_enabled} />
              Включить отправку писем
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
                <span className="text-sm font-medium">Логин</span>
                <input name="smtp_username" defaultValue={settings.smtp_username || ''} className="rounded-2xl border px-4 py-3" placeholder="noreply@koard.ru" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">От кого</span>
                <input name="smtp_from" defaultValue={settings.smtp_from || ''} className="rounded-2xl border px-4 py-3" placeholder="noreply@koard.ru" />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-medium">Пароль</span>
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

            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              Если SMTP-порты недоступны с VDS, тест отправки покажет ошибку таймаута. В этом случае код входа временно пишется в логи backend.
            </div>

            <div className="flex justify-end">
              <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="submit">Сохранить настройки</button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Тест отправки</h2>
          <p className="mt-1 text-sm text-slate-500">Отправит тестовый код 123456 на указанный адрес.</p>
          <form action={testEmailSettingsAction} className="mt-5 flex flex-col gap-3 md:flex-row">
            <input name="test_email" className="flex-1 rounded-2xl border px-4 py-3" placeholder="email для теста" />
            <button className="rounded-2xl border px-5 py-3 font-semibold text-slate-700" type="submit">Отправить тест</button>
          </form>
        </section>
      </div>
    </Shell>
  );
}
