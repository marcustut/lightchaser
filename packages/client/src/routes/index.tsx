import { Suspense, FunctionComponent } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { ARCamera } from '@/features/ar';
import { CountDown } from '@/features/game';
import { Reaction } from '@/features/reaction';
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
      // { path: '/onboard', element: <Onboard /> },
      // { path: '/live', element: <Live /> },
      { path: '/ar', element: <ARCamera /> },
      { path: '/timer', element: <CountDown /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export const AppRoutes: FunctionComponent = () => {
  const element = useRoutes([...publicRoutes]);
  return element;
};
