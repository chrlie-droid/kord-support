'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function syncTicketToPyrusAction(ticketId: number) {
  const response = await fetch(`${API_BASE_URL}/pyrus/tickets/${ticketId}/sync`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Не удалось синхронизировать с Pyrus');
  }

  revalidatePath(`/desk/${ticketId}`);
  revalidatePath('/desk');
}
