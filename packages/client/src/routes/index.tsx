import { Loading } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { Suspense, FunctionComponent } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';

import { AdminRoutes } from '@/features/admin';
import { AppWithUser, SelfAuth } from '@/features/auth';
import { Help } from '@/features/help';
import { InteractiveRoutes } from '@/features/interactive';
import { HomePage } from '@/features/landing';
import { Map } from '@/features/map';
// import { Reaction } from '@/features/reaction';
import { TechgameRoutes } from '@/features/tech';
import { Timer } from '@/features/timer';
// import { Live } from '@/features/registration';

const App: FunctionComponent = () => (
  <Suspense fallback={<Loading />}>
    <Outlet />
  </Suspense>
);

const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/auth/:identityCardNumber', element: <SelfAuth /> },
      { path: '/interactive/*', element: <InteractiveRoutes /> },
      { path: '/admin/*', element: <AdminRoutes /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

const protectedRoutes = (user: User) => [
  {
    path: '/',
    element: <AppWithUser firebaseUser={user} />,
    children: [
      { path: '/', element: <Navigate to="/tech" /> },
      { path: '/map', element: <Map /> },
      { path: '/timer', element: <Timer /> },
      { path: '/help', element: <Help /> },
      { path: '/interactive/*', element: <InteractiveRoutes /> },
      { path: '/admin/*', element: <AdminRoutes /> },
      { path: '/tech/*', element: <TechgameRoutes /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export const AppRoutes: FunctionComponent = () => {
  const { data } = useSigninCheck();
  const element = useRoutes([
    ...(data.signedIn && data.user ? protectedRoutes(data.user) : publicRoutes),
  ]);
  return element;
};
