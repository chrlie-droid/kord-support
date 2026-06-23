'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function sendClientMessageAction(ticketId: number, formData: FormData) {
  const body = String(formData.get('body') || '').trim();
  if (!body) return;

  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ticket_id: ticketId,
      author_name: 'Клиент',
      body,
      is_internal: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить сообщение');
  }

  revalidatePath(`/client/requests/${ticketId}`);
  revalidatePath(`/desk/${ticketId}`);
}

export async function uploadClientAttachmentAction(ticketId: number, formData: FormData) {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return;

  const uploadData = new FormData();
  uploadData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/attachments?author_name=${encodeURIComponent('Клиент')}`, {
    method: 'POST',
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить файл');
  }

  revalidatePath(`/client/requests/${ticketId}`);
  revalidatePath(`/desk/${ticketId}`);
}
