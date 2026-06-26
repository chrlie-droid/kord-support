'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function saveEmailSettingsAction(formData: FormData) {
  const smtpPassword = String(formData.get('smtp_password') || '').trim();
  const body: Record<string, unknown> = {
    smtp_enabled: formData.get('smtp_enabled') === 'on',
    smtp_host: String(formData.get('smtp_host') || '').trim(),
    smtp_port: Number(formData.get('smtp_port') || 587),
    smtp_username: String(formData.get('smtp_username') || '').trim(),
    smtp_from: String(formData.get('smtp_from') || '').trim(),
    smtp_starttls: formData.get('smtp_starttls') === 'on',
    smtp_ssl: formData.get('smtp_ssl') === 'on',
  };

  if (smtpPassword) {
    body.smtp_password = smtpPassword;
  }

  const response = await fetch(`${API_BASE_URL}/admin/email-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error('Email settings save failed', await response.text());
  }

  revalidatePath('/settings');
}

export async function testEmailSettingsAction(formData: FormData) {
  const email = String(formData.get('test_email') || '').trim();
  if (!email) {
    console.error('Email test skipped: empty test_email');
    revalidatePath('/settings');
    return;
  }

  const response = await fetch(`${API_BASE_URL}/admin/email-settings/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    console.error('Email test failed', await response.text());
  }

  revalidatePath('/settings');
}
