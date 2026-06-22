'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function createClientAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  const payload = {
    name,
    inn: String(formData.get('inn') || '').trim() || null,
    contract_number: String(formData.get('contract_number') || '').trim() || null,
    support_plan: String(formData.get('support_plan') || '').trim() || null,
    notes: String(formData.get('notes') || '').trim() || null,
  };

  const response = await fetch(`${API_BASE_URL}/crm/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать клиента');
  }

  revalidatePath('/crm');
}
