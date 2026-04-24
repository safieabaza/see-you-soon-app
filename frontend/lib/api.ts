const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export const fetchProperties = async (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, String(value));
  });
  const response = await fetch(`${BASE_URL}/api/properties?${query.toString()}`);
  return response.json();
};

export const fetchProperty = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/api/properties/${slug}`);
  return response.json();
};

export const createBookingCheckout = async (payload: any) => {
  const response = await fetch(`${BASE_URL}/api/bookings/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
};

export const fetchAdminStats = async (headers: Record<string, string>) => {
  const response = await fetch(`${BASE_URL}/api/admin/analytics`, { headers });
  return response.json();
};

export const fetchLeads = async (headers: Record<string, string>) => {
  const response = await fetch(`${BASE_URL}/api/leads`, { headers });
  return response.json();
};

export const updateLeadStatus = async (id: string, status: string, headers: Record<string, string>) => {
  const response = await fetch(`${BASE_URL}/api/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ status })
  });
  return response.json();
};

export const addLeadNote = async (id: string, content: string, authorId: string, headers: Record<string, string>) => {
  const response = await fetch(`${BASE_URL}/api/leads/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ content, authorId })
  });
  return response.json();
};
