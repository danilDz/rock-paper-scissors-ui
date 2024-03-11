import { useState, useCallback } from 'react';
import { IHttpHookReturnValue } from './interfaces/http-hook.interface';
import { ContentProcess } from '../utils/setContent';

export const useHttp = (): IHttpHookReturnValue => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [process, setProcess] = useState<ContentProcess>('loading');

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
        const options = { method, headers };
        if (method !== 'GET')
          Object.assign(options, { body: JSON.stringify(body) });
        const response = await fetch(url, options);
        if (!response.ok) {
          const json = await response.json();
          setLoading(false);
          setError(json.message);
          setProcess('error');
          return json;
        }
        const data =
          returnType === 'json' ? await response.json() : await response.text();
        setLoading(false);
        return data;
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError('Something went wrong!');
        setProcess('error');
        return { statusCode: 400, message: 'Something went wrong!' };
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
