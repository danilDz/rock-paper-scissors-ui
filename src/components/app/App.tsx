import { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Spinner } from '../spinner/Spinner';
import './App.scss';

const Page404 = lazy(() => import('../pages/Page404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <div className="app">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
