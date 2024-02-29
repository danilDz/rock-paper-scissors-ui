import { Link } from 'react-router-dom';
import cookie from 'js-cookie';
import { Error } from '../error/Error';
import './Page404.scss';

const Page404: React.FunctionComponent = () => {
  const jwt = cookie.get('jwt');

  return (
    <div className="page404MainDiv">
      <Error />
      <p>This page doesn't exist!</p>
      <Link to={jwt ? '/' : '/login'}>
        Go to {jwt ? 'Main Page' : 'Login Page'}
      </Link>
    </div>
  );
};

export default Page404;
