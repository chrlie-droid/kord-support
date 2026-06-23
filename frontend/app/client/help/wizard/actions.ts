'use server';

import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function createTicketFromWizardAction(formData: FormData) {
  const venueId = Number(formData.get('venue_id') || 0);
  const categoryTitle = String(formData.get('category_title') || 'Обращение').trim();
  const objectName = String(formData.get('object_name') || '').trim();
  const answer = String(formData.get('answer') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!venueId || !message) {
    throw new Error('Нужно выбрать объект и написать сообщение');
  }

  const description = [
    objectName ? `Объект: ${objectName}` : null,
    categoryTitle ? `Категория: ${categoryTitle}` : null,
    answer ? `Уточнение: ${answer}` : null,
    '',
    message,
  ]
    .filter((item) => item !== null)
    .join('\n');

  const ticketResponse = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      venue_id: venueId,
      title: categoryTitle,
      description,
      priority: 'normal',
    }),
  });

  if (!ticketResponse.ok) {
    throw new Error('Не удалось создать обращение');
  }

  const ticket = await ticketResponse.json();

  await fetch(`${API_BASE_URL}/tickets/${ticket.id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ticket_id: ticket.id,
      author_name: 'Клиент',
      body: message,
      is_internal: false,
    }),
  });

  redirect(`/client/requests/${ticket.id}`);
}
