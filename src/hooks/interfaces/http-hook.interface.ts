export interface IHttpHookReturnValue {
  loading: boolean;
  error: null | string;
  process: string;
  setProcess: (value: string) => void;
  request: (
    url: string,
    returnType: 'string' | 'json',
    method?: string,
    body?: object,
    headers?: object,
  ) => Promise<object>;
  clearError: () => void;
}
