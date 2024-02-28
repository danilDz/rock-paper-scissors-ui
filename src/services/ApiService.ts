import cookie from 'js-cookie';
import { useHttp } from '../hooks/http.hook';

const useApiService = () => {
  const { loading, error, process, setProcess, request, clearError } =
    useHttp();

  const baseUrl = import.meta.env.VITE_API_URL;

  const signup = async (username: string, password: string) => {
    return await request(
      `${baseUrl}/api/auth/signup`,
      'json',
      'POST',
      {
        username,
        password,
        isAdmin: false,
      },
      {
        'Content-Type': 'application/json',
      },
    );
  };

  const signin = async (username: string, password: string) => {
    return await request(
      `${baseUrl}/api/auth/signin`,
      'string',
      'POST',
      {
        username,
        password,
      },
      {
        'Content-Type': 'application/json',
      },
    );
  };

  const signout = async () => {
    return await request(
      `${baseUrl}/api/auth/signout`,
      'string',
      'POST',
      undefined,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get('jwt')}`,
      },
    );
  };

  return {
    loading,
    error,
    process,
    setProcess,
    clearError,
    signup,
    signin,
    signout,
  };
};

export default useApiService;
