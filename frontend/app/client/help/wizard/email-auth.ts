const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function requestEmailCode(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/email/request-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить код');
  }

  return response.json();
}

export async function verifyEmailCode(email: string, code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/email/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    throw new Error('Неверный код');
  }

  return response.json() as Promise<{ verified: boolean; email: string }>;
}
