export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface UsageInfo {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  plan: string;
}
