import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import useApiService from '../../services/ApiService';
import FormComponent from '../form/Form';

const SignupForm: React.FunctionComponent = () => {
  const { signup, clearError, setProcess } = useApiService();
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const title = 'Register';
  const buttonTitle = 'Create account';
  const JWT_EXPIRE_HOURS = import.meta.env.VITE_JWT_EXPIRE_HOURS;

  const onSubmitHandler = async (username: string, password: string) => {
    clearError();
    setError(null);
    const response = await signup(username, password);
    if (response.statusCode) {
      setError(response.message);
      return;
    }
    setProcess('confirmed');
    cookie.set('jwt', response.token, { expires: (1 / 24) * JWT_EXPIRE_HOURS });
    navigate('/');
  };

  return (
    <FormComponent
      title={title}
      buttonTitle={buttonTitle}
      type="signup"
      onSubmitHandler={onSubmitHandler}
      error={error}
    />
  );
};

export default SignupForm;
