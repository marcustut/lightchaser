/* eslint-disable no-restricted-imports */
import { Suspense, FunctionComponent } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { CountDown } from '@/features/game';
import { InteractiveRoutes } from '@/features/interactive/routes/InteractiveRoutes';
import { Reaction } from '@/features/reaction';
import { TechgameRoutes } from '@/features/tech/routes/TechGameRoutes';
// import { Live } from '@/features/registration';

const App: FunctionComponent = () => (
  <Suspense fallback={<div>loading...x</div>}>
    <Outlet />
  </Suspense>
);

const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Reaction /> },
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
