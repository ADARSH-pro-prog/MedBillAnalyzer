import { API_BASE_URL } from '../constants';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  // 1. Sanitize Base URL (remove trailing slash) and Endpoint (ensure leading slash)
  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '').trim();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;

  // 2. Prepare Headers
  // tunnel providers often block requests unless specific headers are present to bypass warning pages
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Bypass-Tunnel-Reminder': 'true',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(headers as Record<string, string>),
  };

  console.log(`[API] Requesting: ${url}`);

  try {
    const response = await fetch(url, {
      ...rest,
      mode: 'cors', // Explicitly request CORS
      credentials: 'omit', // Important: prevents CORS errors if server sends 'Access-Control-Allow-Origin: *'
      referrerPolicy: 'no-referrer', // Privacy and prevents some firewall blocks
      headers: mergedHeaders,
    });

    // 3. Check for JSON content type to safely parse
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.indexOf('application/json') !== -1;

    if (!response.ok) {
      // Try to extract error message from JSON or Text body
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        // Try parsing as JSON first
        try {
          const jsonError = JSON.parse(errorText);
          if (jsonError.msg) errorMessage = jsonError.msg;
          else if (jsonError.error) errorMessage = jsonError.error;
          else if (jsonError.message) errorMessage = jsonError.message;
          else if (jsonError.detail) errorMessage = typeof jsonError.detail === 'string' ? jsonError.detail : JSON.stringify(jsonError.detail);
        } catch {
          // If not JSON, use the text body if it's short enough and not HTML
          if (errorText.length < 200 && !errorText.includes('<!DOCTYPE html>')) errorMessage = errorText;
          else if (errorText.includes('ngrok')) errorMessage = "Tunnel Connection Error: Ngrok interface detected.";
        }
      } catch (e) {
        // Failed to read body, use default status text
      }
      
      throw new Error(errorMessage);
    }

    // 4. Success Path
    if (isJson) {
      return await response.json();
    } else {
      // If status is 204 (No Content), return empty object
      if (response.status === 204) return {} as T;
      
      // Fallback: Try parsing text as JSON anyway, just in case Content-Type header is missing
      const text = await response.text();
      try {
        return text ? JSON.parse(text) : ({} as T);
      } catch (e) {
        console.warn("[API] Response was not JSON:", text);
        // If it's HTML, it's likely an error page from the proxy
        if (text.includes('<!DOCTYPE html>')) {
             throw new Error("Received HTML instead of JSON. The server URL might be incorrect or returning a dashboard page.");
        }
        throw new Error("Server returned invalid response format");
      }
    }
  } catch (error: any) {
    console.error(`[API] Fetch Error (${url}):`, error);
    
    if (error.message === 'Failed to fetch') {
       throw new Error('Network Error: Unable to reach server. Verify the backend is running and the URL is correct.');
    }
    
    throw error;
  }
}