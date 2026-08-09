const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.ucarecon.ca'
const TOKEN_KEY = 'cc_access_token'

export class ApiError extends Error {
  response: { status: number; data: unknown }

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.response = { status, data }
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null | undefined) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

interface ApiResponse<T> {
  data: T
  status: number
}

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/api/front/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError((data as { message?: string })?.message || 'Request failed', res.status, data)
  }

  return { data: data as T, status: res.status }
}

export const api = {
  get: <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T = unknown>(path: string) => request<T>('DELETE', path),
}
