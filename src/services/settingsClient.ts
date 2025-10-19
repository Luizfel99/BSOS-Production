// Settings Client Services
// Simplified API calls for settings management

export async function getSettings() {
  const res = await fetch('/api/settings', {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
}

export async function updateSetting(data: {
  category: string;
  key: string;
  value: string;
  type?: 'STRING' | 'BOOLEAN' | 'NUMBER' | 'JSON' | 'ENCRYPTED';
  encrypted?: boolean;
}) {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}