/**
 * API Client for interacting with Google Apps Script Web App
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(action: string, data: any = {}, token: string | null = null) {
  if (!API_BASE_URL) {
    throw new Error('API Base URL is not configured');
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      data,
      token,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Request failed: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.success === false) {
    throw new Error(result.error || 'Unknown API error');
  }

  return result;
}
