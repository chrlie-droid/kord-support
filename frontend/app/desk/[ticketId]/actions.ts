'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function sendOperatorMessageAction(ticketId: number, formData: FormData) {
  const body = String(formData.get('body') || '').trim();
  if (!body) return;

  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ticket_id: ticketId,
      author_name: 'Оператор',
      body,
      is_internal: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить сообщение');
  }

  revalidatePath(`/desk/${ticketId}`);
  revalidatePath(`/client/requests/${ticketId}`);
}
