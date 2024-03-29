import React, { useEffect, useState } from 'react';
import useApiService from '../../services/ApiService';
import setContent from '../../utils/setContent';
import { Game } from '../../models/game.interface';
import './GameField.scss';

export interface IGameFieldParameters {
  userId: string | null;
}

interface IViewParameters {
  gameStatus: null | string;
  game: null | Game;
  userJoined: null | boolean;
  onCreateGameHandler: () => void;
  onJoinGameHandler: () => void;
  onMakeChoiceHandler: (choice: string) => void;
  userLabel: null | string;
  opponentLabel: null | string;
}

interface IOpponentAndScoreDivsParameters {
  opponent: Game['firstPlayerId'];
  userScore: number;
  opponentScore: number;
}

type GameStatus =
  | 'waiting-for-opponent'
  | 'not-created'
  | 'created'
  | 'updated';

const GameField: React.FunctionComponent<IGameFieldParameters> = ({
  userId,
}) => {
  const {
    process,
    setProcess,
    clearError,
    getAllUsers,
    getGame,
    createGame,
    makeChoice,
    determineGameResult,
    joinGame,
  } = useApiService();
  const [gameStatus, setGameStatus] = useState<null | GameStatus>(null);
  const [game, setGame] = useState<null | Game>(null);
  const [userJoined, setUserJoined] = useState<null | boolean>(null);
  const [opponents, setOpponents] = useState<null | string[]>(null);
  const [userLabel, setUserLabel] = useState<null | string>(null);
  const [opponentLabel, setOpponentLabel] = useState<null | string>(null);

  useEffect(() => {
    async function fetchGameStatus() {
      clearError();
      const allUsers = await getAllUsers();
      if (allUsers.statusCode) return;
      const fetchedOpponents = allUsers.filter(
        (user: string) => user !== userId,
      );
      if (!fetchedOpponents.length) {
        setGameStatus('waiting-for-opponent');
        setProcess('confirmed');
        return;
      }
      setOpponents(fetchedOpponents);

      const existedGame = await getGame();
      if (existedGame.gameNotFound) {
        setGameStatus('not-created');
        setProcess('confirmed');
        return;
      }

      if (existedGame.firstPlayerId.id === userId) {
        setUserLabel('first');
        setOpponentLabel('second');
      } else {
        setUserLabel('second');
        setOpponentLabel('first');
      }

      if (
        existedGame!.firstPlayerChoice !== 'not-selected' &&
        existedGame!.secondPlayerChoice !== 'not-selected'
      )
        await determineGameResult();

      setGameStatus('created');
      setUserJoined(existedGame[`${userLabel}PlayerJoined`]);
      setGame(existedGame);
      setProcess('confirmed');
    }

    fetchGameStatus();
  }, [gameStatus]);

  const onCreateGameHandler = async () => {
    clearError();
    const game = await createGame(userId!, opponents![0]);
    if (game.statusCode) return;
    setGameStatus('created');
  };

  const onJoinGameHandler = async () => {
    clearError();
    const result = await joinGame(game!.id, `${userLabel}PlayerJoined`);
    if (result.statusCode) return;
    setGameStatus('updated');
  };

  const onMakeChoiceHandler = async (choice: string) => {
    if (choice === 'not-selected') {
      const game = await getGame();
      if (game[`${opponentLabel}PlayerChoice`] !== 'not-selected') {
        setGameStatus('updated');
        return;
      }
    }

    clearError();
    const result = await makeChoice(
      game!.id,
      `${userLabel}PlayerChoice`,
      choice,
    );
    if (result.statusCode) return;
    setGameStatus('updated');
  };

  return (
    <>
      {setContent(process, View, {
        gameStatus,
        game,
        userJoined,
        onCreateGameHandler,
        onJoinGameHandler,
        onMakeChoiceHandler,
        userLabel,
        opponentLabel,
      })}
    </>
  );
};

const View: React.FunctionComponent<IViewParameters> = ({
  gameStatus,
  game,
  userJoined,
  onCreateGameHandler,
  onJoinGameHandler,
  onMakeChoiceHandler,
  userLabel,
  opponentLabel,
}) => {
  const opponent = game![`${opponentLabel}PlayerId` as 'firstPlayerId'];
  const opponentScore =
    game![`${opponentLabel}PlayerScore` as 'firstPlayerScore'];
  const userScore = game![`${userLabel}PlayerScore` as 'firstPlayerScore'];
  const userChoice = game![`${userLabel}PlayerChoice` as 'firstPlayerChoice'];
  switch (gameStatus) {
    case 'waiting-for-opponent':
      return (
        <>
          <div className="gameFieldDiv">
            <h3>You have to wait for second user!</h3>
          </div>
        </>
      );
    case 'not-created':
      return (
        <>
          <div className="gameFieldDiv">
            <h3>You can create new game!</h3>
            <button className="button" onClick={onCreateGameHandler}>
              Create new game
            </button>
          </div>
        </>
      );
    case 'created':
      if (!userJoined) {
        return (
          <>
            <div className="gameFieldDiv">
              <OpponentAndScoreDivs
                opponent={opponent}
                userScore={userScore}
                opponentScore={opponentScore}
              />
              <div className="gameFieldDiv_inner controlsDiv">
                <button className="button" onClick={onJoinGameHandler}>
                  Start new round
                </button>
              </div>
            </div>
          </>
        );
      }
      if (userChoice === 'not-selected') {
        return (
          <>
            <div className="gameFieldDiv">
              <OpponentAndScoreDivs
                opponent={opponent}
                userScore={userScore}
                opponentScore={opponentScore}
              />
              <div className="gameFieldDiv_inner choiceField">
                <h4>Your choices:</h4>
                <div className="choicesDiv">
                  <div
                    className="choice"
                    onClick={() => onMakeChoiceHandler('rock')}
                  >
                    <RockSvg />
                  </div>
                  <div
                    className="choice"
                    onClick={() => onMakeChoiceHandler('paper')}
                  >
                    <PaperSvg />
                  </div>
                  <div
                    className="choice"
                    onClick={() => onMakeChoiceHandler('scissors')}
                  >
                    <ScissorsSvg />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="gameFieldDiv">
              <OpponentAndScoreDivs
                opponent={opponent}
                userScore={userScore}
                opponentScore={opponentScore}
              />
              <div className="gameFieldDiv_inner choiceField">
                <h4>
                  Your choice: <br />
                </h4>
                <h2>{userChoice.toUpperCase()}</h2>
              </div>
              <div className="gameFieldDiv_inner controlsDiv">
                <button
                  className="button"
                  onClick={() => onMakeChoiceHandler('not-selected')}
                >
                  Change choice
                </button>
              </div>
            </div>
          </>
        );
      }
  }
};

const OpponentAndScoreDivs: React.FunctionComponent<
  IOpponentAndScoreDivsParameters
> = ({ opponent, userScore, opponentScore }) => {
  return (
    <>
      <div className="gameFieldDiv_inner opponentDiv">
        <h3>
          Your opponent: <br />
          {opponent.username} ({opponent.status})
        </h3>
      </div>
      <div className="gameFieldDiv_inner scoreDiv">
        <h3>
          Score: <br />
          <pre>
            You {userScore} : {opponentScore} {opponent.username}
          </pre>
        </h3>
      </div>
    </>
  );
};

const RockSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M144 64c0-8.8 7.2-16 16-16s16 7.2 16 16c0 9.1 5.1 17.4 13.3 21.5s17.9 3.2 25.1-2.3c2.7-2 6-3.2 9.6-3.2c8.8 0 16 7.2 16 16c0 9.1 5.1 17.4 13.3 21.5s17.9 3.2 25.1-2.3c2.7-2 6-3.2 9.6-3.2c8.8 0 16 7.2 16 16c0 9.1 5.1 17.4 13.3 21.5s17.9 3.2 25.1-2.3c2.7-2 6-3.2 9.6-3.2c8.8 0 16 7.2 16 16V264c0 31.3-20 58-48 67.9c-9.6 3.4-16 12.5-16 22.6V488c0 13.3 10.7 24 24 24s24-10.7 24-24V370.2c38-20.1 64-60.1 64-106.2V160c0-35.3-28.7-64-64-64c-2.8 0-5.6 .2-8.3 .5C332.8 77.1 311.9 64 288 64c-2.8 0-5.6 .2-8.3 .5C268.8 45.1 247.9 32 224 32c-2.8 0-5.6 .2-8.3 .5C204.8 13.1 183.9 0 160 0C124.7 0 96 28.7 96 64v64.3c-11.7 7.4-22.5 16.4-32 26.9l17.8 16.1L64 155.2l-9.4 10.5C40 181.8 32 202.8 32 224.6v12.8c0 49.6 24.2 96.1 64.8 124.5l13.8-19.7L96.8 361.9l8.9 6.2c6.9 4.8 14.4 8.6 22.3 11.3V488c0 13.3 10.7 24 24 24s24-10.7 24-24V359.9c0-12.6-9.8-23.1-22.4-23.9c-7.3-.5-14.3-2.9-20.3-7.1l-13.1 18.7 13.1-18.7-8.9-6.2C96.6 303.1 80 271.3 80 237.4V224.6c0-9.9 3.7-19.4 10.3-26.8l9.4-10.5c3.8-4.2 7.9-8.1 12.3-11.6V208c0 8.8 7.2 16 16 16s16-7.2 16-16V142.3 128 64z" />
    </svg>
  );
};

const PaperSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 0c-25.3 0-47.2 14.7-57.6 36c-7-2.6-14.5-4-22.4-4c-35.3 0-64 28.7-64 64V261.5l-2.7-2.7c-25-25-65.5-25-90.5 0s-25 65.5 0 90.5L106.5 437c48 48 113.1 75 181 75H296h8c1.5 0 3-.1 4.5-.4c91.7-6.2 165-79.4 171.1-171.1c.3-1.5 .4-3 .4-4.5V160c0-35.3-28.7-64-64-64c-5.5 0-10.9 .7-16 2V96c0-35.3-28.7-64-64-64c-7.9 0-15.4 1.4-22.4 4C303.2 14.7 281.3 0 256 0zM240 96.1c0 0 0-.1 0-.1V64c0-8.8 7.2-16 16-16s16 7.2 16 16V95.9c0 0 0 .1 0 .1V232c0 13.3 10.7 24 24 24s24-10.7 24-24V96c0 0 0 0 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16v55.9c0 0 0 .1 0 .1v80c0 13.3 10.7 24 24 24s24-10.7 24-24V160.1c0 0 0-.1 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16V332.9c-.1 .6-.1 1.3-.2 1.9c-3.4 69.7-59.3 125.6-129 129c-.6 0-1.3 .1-1.9 .2H296h-8.5c-55.2 0-108.1-21.9-147.1-60.9L52.7 315.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L119 336.4c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2V96c0-8.8 7.2-16 16-16c8.8 0 16 7.1 16 15.9V232c0 13.3 10.7 24 24 24s24-10.7 24-24V96.1z" />
    </svg>
  );
};

const ScissorsSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M.2 276.3c-1.2-35.3 26.4-65 61.7-66.2l3.3-.1L57 208.1C22.5 200.5 .7 166.3 8.3 131.8S50.2 75.5 84.7 83.2l173 38.3c2.3-2.9 4.7-5.7 7.1-8.5l18.4-20.3C299.9 74.5 323.5 64 348.3 64l10.2 0c54.1 0 104.1 28.7 131.3 75.4l1.5 2.6c13.6 23.2 20.7 49.7 20.7 76.6L512 344c0 66.3-53.7 120-120 120l-8 0-96 0c-35.3 0-64-28.7-64-64c0-2.8 .2-5.6 .5-8.3c-19.4-11-32.5-31.8-32.5-55.7c0-.8 0-1.6 0-2.4L66.4 338c-35.3 1.2-65-26.4-66.2-61.7zm63.4-18.2c-8.8 .3-15.7 7.7-15.4 16.5s7.7 15.7 16.5 15.4l161.5-5.6c9.8-.3 18.7 5.3 22.7 14.2s2.2 19.3-4.5 26.4c-2.8 2.9-4.4 6.7-4.4 11c0 8.8 7.2 16 16 16c9.1 0 17.4 5.1 21.5 13.3s3.2 17.9-2.3 25.1c-2 2.7-3.2 6-3.2 9.6c0 8.8 7.2 16 16 16l96 0 8 0c39.8 0 72-32.2 72-72l0-125.4c0-18.4-4.9-36.5-14.2-52.4l-1.5-2.6c-18.6-32-52.8-51.6-89.8-51.6l-10.2 0c-11.3 0-22 4.8-29.6 13.1l-17.5-15.9 17.5 15.9-18.4 20.3c-.6 .6-1.1 1.3-1.7 1.9l57 13.2c8.6 2 14 10.6 12 19.2s-10.6 14-19.2 12l-85.6-19.7L74.3 130c-8.6-1.9-17.2 3.5-19.1 12.2s3.5 17.2 12.2 19.1l187.5 41.6c10.2 2.3 17.8 10.9 18.7 21.4l.1 1c.6 6.6-1.5 13.1-5.8 18.1s-10.6 7.9-17.2 8.2L63.6 258.1z" />
    </svg>
  );
};

export default GameField;
