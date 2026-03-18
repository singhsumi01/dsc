/**
 * API Client for interacting with Google Apps Script Web App
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(action: string, data: any = {}, token: string | null = null) {
  if (!API_BASE_URL) {
    throw new Error('API Base URL is not configured');
  }

  console.log(`[API] Requesting ${action} from ${API_BASE_URL.substring(0, 40)}...`);

  if (API_BASE_URL.includes('/macros/s/') && API_BASE_URL.includes('/dev')) {
    console.warn('[API] WARNING: You are using a /dev URL. This will likely fail for anyone but the script owner. Use /exec instead.');
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    mode: 'cors', // Explicitly set CORS mode
    headers: {
      // Using 'text/plain' avoids CORS preflight (OPTIONS) in most browsers
      // while still allowing us to send the JSON string.
      'Content-Type': 'text/plain',
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
