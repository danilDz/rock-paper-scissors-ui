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
  const { signout, getGame, resetGame } = useApiService();
  const navigate = useNavigate();

  const onLogOut = async () => {
    const game = await getGame();
    if (game) await resetGame(game.id);
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
