import { Error as ErrorComponent } from '../components/error/Error';
import { Spinner } from '../components/spinner/Spinner';

const setContent = (
  process: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FunctionComponent<any>,
  data: object,
) => {
  switch (process) {
    case 'loading':
      return <Spinner />;
    case 'confirmed':
      return <Component {...data} />;
    case 'error':
      return <ErrorComponent />;
    default:
      throw new Error('Unexpected process state!');
  }
};

export default setContent;
