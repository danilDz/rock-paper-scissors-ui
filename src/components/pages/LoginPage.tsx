import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import SigninForm from '../signinForm/SigninForm';

const LoginPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (cookie.get('jwt')) navigate('/');
  }, []);

  return <SigninForm />;
};

export default LoginPage;
