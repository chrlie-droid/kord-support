'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export type SettingsActionState = {
  ok: boolean;
  message: string;
};

export async function saveEmailSettingsAction(_prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const resendApiKey = String(formData.get('resend_api_key') || '').trim();
  const smtpPassword = String(formData.get('smtp_password') || '').trim();
  const body: Record<string, unknown> = {
    email_provider: String(formData.get('email_provider') || 'smtp').trim(),
    email_from: String(formData.get('email_from') || '').trim(),
    smtp_enabled: formData.get('smtp_enabled') === 'on',
    smtp_host: String(formData.get('smtp_host') || '').trim(),
    smtp_port: Number(formData.get('smtp_port') || 587),
    smtp_username: String(formData.get('smtp_username') || '').trim(),
    smtp_from: String(formData.get('smtp_from') || '').trim(),
    smtp_starttls: formData.get('smtp_starttls') === 'on',
    smtp_ssl: formData.get('smtp_ssl') === 'on',
  };

  if (resendApiKey) {
    body.resend_api_key = resendApiKey;
  }

  if (smtpPassword) {
    body.smtp_password = smtpPassword;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/email-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return { ok: false, message: `Настройки не сохранены: ${await response.text()}` };
    }

    const data = await response.json();
    revalidatePath('/settings');
    return { ok: true, message: `Настройки сохранены. Активный провайдер: ${data.email_provider || 'smtp'}.` };
  } catch (error) {
    return { ok: false, message: `Настройки не сохранены: ${error instanceof Error ? error.message : 'неизвестная ошибка'}` };
  }
}

export async function testEmailSettingsAction(_prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const email = String(formData.get('test_email') || '').trim();
  if (!email) {
    return { ok: false, message: 'Укажите email для тестовой отправки.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/email-settings/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();
    if (!response.ok) {
      return { ok: false, message: `Тест не прошел: ${text}` };
    }

    const data = JSON.parse(text);
    revalidatePath('/settings');
    if (data.delivery === 'sent') {
      return { ok: true, message: `Тестовое письмо отправлено через ${data.provider}. Проверьте почту ${email}.` };
    }
    return { ok: true, message: `Тест выполнен в режиме ${data.delivery} через ${data.provider}. Если письма нет, код записан в логи backend.` };
  } catch (error) {
    return { ok: false, message: `Тест не прошел: ${error instanceof Error ? error.message : 'неизвестная ошибка'}` };
  }
}
