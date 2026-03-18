/**
 * API Client for interacting with Google Apps Script Web App
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(action: string, data: any = {}, token: string | null = null) {
  if (!API_BASE_URL) {
    throw new Error('API Base URL is not configured. Check environment variables.');
  }

  console.log(`[API] Stream Initiated: ${action}`);

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action,
        data,
        token,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error(`[API] Protocol Failure: ${response.status}`, errorText);
      throw new Error(`API Gateway Signal Failure: ${response.status}`);
    }

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('[API] Parse Overflow: Non-JSON Response Observed', text);
      throw new Error('Infrastructure parse mismatch. Please verify script deployment.');
    }

    if (result.success === false) {
      throw new Error(result.error || 'Identity rejection or protocol error');
    }

    return result;
  } catch (err: any) {
    console.error(`[API] System Exception [${action}]:`, err.message);
    throw err;
  }
}
