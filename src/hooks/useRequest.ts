import { useState, useCallback } from 'react';

type RequestFunction<T> = (params?: any) => Promise<T>;

interface UseRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  request: (params?: any) => Promise<void>;
}

function useRequest<T>(requestFunction: RequestFunction<T>): UseRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(
    async (params?: any) => {
      setLoading(true);
      setError(null);

      try {
        const result = await requestFunction(params);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [requestFunction]
  );

  return { data, loading, error, request };
}

export default useRequest;
