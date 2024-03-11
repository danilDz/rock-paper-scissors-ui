import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import useApiService from '../../services/ApiService';
import setContent from '../../utils/setContent';
import Header, { IHeaderParameters } from '../header/Header';
import GameField, { IGameFieldParameters } from '../gameField/GameField';

interface IMainPageParameters extends IHeaderParameters, IGameFieldParameters {}

const MainPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { checkUser, clearError, process, setProcess } = useApiService();
  const [username, setUsername] = useState<null | string>(null);
  const [userId, setUserId] = useState<null | string>(null);

  useEffect(() => {
    if (!cookie.get('jwt')) {
      navigate('/login');
      return;
    }

    async function fetchUser() {
      clearError();
      const user = await checkUser();
      if (user.statusCode) return;
      setUsername(user.username);
      setUserId(user.id);
      setProcess('confirmed');
    }

    fetchUser();
  }, []);

  return <>{setContent(process, View, { username, userId })}</>;
};

const View: React.FunctionComponent<IMainPageParameters> = ({
  username,
  userId,
}) => {
  return (
    <>
      <Header username={username} />
      <GameField userId={userId} />
    </>
  );
};

export default MainPage;
