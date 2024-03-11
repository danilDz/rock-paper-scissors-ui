export interface Game {
  id: string;
  firstPlayerScore: number;
  secondPlayerScore: number;
  firstPlayerChoice: string;
  secondPlayerChoice: string;
  firstPlayerId: {
    id: string;
    isAdmin: boolean;
    status: string;
    username: string;
  };
  secondPlayerId: {
    id: string;
    isAdmin: boolean;
    status: string;
    username: string;
  };
}
