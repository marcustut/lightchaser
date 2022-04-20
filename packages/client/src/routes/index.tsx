import { Suspense, FunctionComponent } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { AdminRoutes } from '@/features/admin';
import { Auth } from '@/features/auth';
import { Help } from '@/features/help';
import { InteractiveRoutes } from '@/features/interactive';
import { HomePage } from '@/features/landing';
import { Map } from '@/features/map';
// import { Reaction } from '@/features/reaction';
import { TechgameRoutes } from '@/features/tech';
import { Timer } from '@/features/timer';
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
      { path: '/', element: <HomePage /> },
      { path: '/auth', element: <Auth /> },
      { path: '/map', element: <Map /> },
      { path: '/timer', element: <Timer /> },
      { path: '/help', element: <Help /> },
      { path: '/admin/*', element: <AdminRoutes /> },
      // { path: '/onboard', element: <Onboard /> },
      // { path: '/live', element: <Live /> },
      { path: '/interactive/*', element: <InteractiveRoutes /> },
      { path: '/tech/*', element: <TechgameRoutes /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export const AppRoutes: FunctionComponent = () => {
  const element = useRoutes([...publicRoutes]);
  return element;
};
