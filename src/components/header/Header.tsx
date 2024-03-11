import cookie from 'js-cookie';
import useApiService from '../../services/ApiService';
import './Header.scss';
import { useNavigate } from 'react-router-dom';

export interface IHeaderParameters {
  username: string | null;
}

const Header: React.FunctionComponent<IHeaderParameters> = ({
  username,
}: IHeaderParameters) => {
  const { signout } = useApiService();
  const navigate = useNavigate();

  const onLogOut = async () => {
    await signout();
    cookie.remove('jwt');
    navigate('/login');
  };

  return (
    <header className="header">
      <h2>Rock, Paper, Scissors Game</h2>
      <nav className="navigationDiv">
        <h4>Hello, {username}</h4>
        <button className="button" onClick={onLogOut}>
          Log out
        </button>
      </nav>
    </header>
  );
};

export default Header;
