export type Client = {
  id: number;
  name: string;
  inn?: string | null;
  kpp?: string | null;
  legal_address?: string | null;
  contract_number?: string | null;
  support_plan?: string | null;
  notes?: string | null;
};

export type Venue = {
  id: number;
  client_id: number;
  name: string;
  venue_type: string;
  address?: string | null;
  phone?: string | null;
  work_hours?: string | null;
  notes?: string | null;
};

export type Contact = {
  id: number;
  client_id: number;
  full_name: string;
  role?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram?: string | null;
  notes?: string | null;
};

export type PassportSection = {
  id: number;
  venue_id: number;
  module_key: string;
  title: string;
  status: string;
  summary?: string | null;
  notes?: string | null;
};

const API_BASE_URL = process.env.API_BASE_URL || 'http://app:8085/api';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getClients(): Promise<Client[]> {
  return apiGet<Client[]>('/crm/clients');
}

export async function getClient(clientId: number): Promise<Client> {
  return apiGet<Client>(`/crm/clients/${clientId}`);
}

export async function getVenues(): Promise<Venue[]> {
  return apiGet<Venue[]>('/crm/venues');
}

export async function getVenue(venueId: number): Promise<Venue> {
  return apiGet<Venue>(`/crm/venues/${venueId}`);
}

export async function getClientVenues(clientId: number): Promise<Venue[]> {
  return apiGet<Venue[]>(`/crm/venues?client_id=${clientId}`);
}

export async function getContacts(): Promise<Contact[]> {
  return apiGet<Contact[]>('/crm/contacts');
}

export async function getClientContacts(clientId: number): Promise<Contact[]> {
  return apiGet<Contact[]>(`/crm/contacts?client_id=${clientId}`);
}

export async function getPassportSections(venueId: number): Promise<PassportSection[]> {
  return apiGet<PassportSection[]>(`/passport/venues/${venueId}/sections`);
}
