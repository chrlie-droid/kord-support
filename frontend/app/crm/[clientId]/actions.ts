'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function createVenueAction(clientId: number, formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  const payload = {
    client_id: clientId,
    name,
    venue_type: String(formData.get('venue_type') || 'other'),
    address: String(formData.get('address') || '').trim() || null,
    phone: String(formData.get('phone') || '').trim() || null,
    work_hours: String(formData.get('work_hours') || '').trim() || null,
    notes: String(formData.get('notes') || '').trim() || null,
  };

  const response = await fetch(`${API_BASE_URL}/crm/venues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать заведение');
  }

  revalidatePath(`/crm/${clientId}`);
  revalidatePath('/crm');
}
