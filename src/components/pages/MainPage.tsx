import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';

const MainPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookie.get('jwt')) navigate('/login');
  }, []);

  return <div>Main page</div>;
};

export default MainPage;
