import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import SignupForm from '../signupForm/SignupForm';

const SignupPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (cookie.get('jwt')) navigate('/');
  }, []);

  return <SignupForm />;
};

export default SignupPage;
