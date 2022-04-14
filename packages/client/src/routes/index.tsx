/* eslint-disable no-restricted-imports */
import { Suspense, FunctionComponent } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { ARCamera } from '@/features/ar';
import { Home } from '@/features/dashboard';
import { CountDown } from '@/features/game';
// import { Reaction } from '@/features/reaction';
import { InteractiveRoutes } from '@/features/interactive/routes/InteractiveRoutes';
import { TechgameRoutes } from '@/features/tech/routes/TechGameRoutes';
// import { Live } from '@/features/registration';

const App: FunctionComponent = () => (
  <Suspense fallback={<div>loading...</div>}>
    <Outlet />
  </Suspense>
);

const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      // { path: '/onboard', element: <Onboard /> },
      // { path: '/live', element: <Live /> },
      { path: '/ar', element: <ARCamera /> },
      { path: '/interactive/*', element: <InteractiveRoutes /> },
      { path: '/tech/*', element: <TechgameRoutes /> },
      { path: '/timer', element: <CountDown /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export const AppRoutes: FunctionComponent = () => {
  const element = useRoutes([...publicRoutes]);
  return element;
};
