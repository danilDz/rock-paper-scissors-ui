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

  const checkUser = async () => {
    return await request(
      `${baseUrl}/api/auth/check`,
      'json',
      'GET',
      undefined,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get('jwt')}`,
      },
    );
  };

  const getAllUsers = async () => {
    return await request(
      `${baseUrl}/api/auth/get/users`,
      'json',
      'GET',
      undefined,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get('jwt')}`,
      },
    );
  };

  const getGame = async () => {
    return await request(`${baseUrl}/api/game/get`, 'json', 'GET', undefined, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.get('jwt')}`,
    });
  };

  const createGame = async (firstPlayerId: string, secondPlayerId: string) => {
    return await request(
      `${baseUrl}/api/game/create`,
      'json',
      'POST',
      { firstPlayerId, secondPlayerId },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get('jwt')}`,
      },
    );
  };

  const makeChoice = async (gameId: string, field: string, value: string) => {
    return await request(
      `${baseUrl}/api/game/update/${gameId}`,
      'json',
      'PATCH',
      { [field]: value },
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
    checkUser,
    getAllUsers,
    getGame,
    createGame,
    makeChoice,
  };
};

export default useApiService;
