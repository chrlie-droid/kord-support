import { SettingsEmailForm } from '@/components/settings-email-form';
import { Shell } from '@/components/shell';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

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
        <SettingsEmailForm settings={settings} />
      </div>
    </Shell>
  );
}
