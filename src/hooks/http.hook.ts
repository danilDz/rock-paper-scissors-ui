import { useState, useCallback } from 'react';
import { IHttpHookReturnValue } from './interfaces/http-hook.interface';

export const useHttp = (): IHttpHookReturnValue => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [process, setProcess] = useState<string>('loading');

  const request = useCallback(
    async (
      url: string,
      returnType: 'string' | 'json',
      method = 'GET',
      body = {},
      headers = {},
    ) => {
      setLoading(true);
      setProcess('loading');
      try {
        const response = await fetch(url, {
          method,
          body: JSON.stringify(body),
          headers,
        });
        if (!response.ok) {
          throw new Error((response as unknown as Error).message);
        }
        const data =
          returnType === 'json' ? await response.json() : await response.text();
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        setError((error as Error).message);
        setProcess('error');
        return error;
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
    setProcess('loading');
  }, []);

  return { loading, error, process, setProcess, request, clearError };
};
