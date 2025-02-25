export interface FetchOptions {
  onSuccess?: (response: unknown) => void;
  onError?: (reason?: any) => void;
  onAbort?: (reason?: any) => void;
  onRetry?: (retry: number, reason?: any) => void;
  onTimeout?: () => void;
  retry?: number;
  timeout?: number;
}
