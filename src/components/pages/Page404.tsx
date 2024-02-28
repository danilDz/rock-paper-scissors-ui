import { Error } from '../error/Error';

const Page404: React.FunctionComponent = () => {
  return (
    <div className='page404MainDiv'>
      <Error />
      <p>This page doesn't exist!</p>
    </div>
  );
};

export default Page404;
