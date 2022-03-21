import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { Reaction, Onboard } from '@/features/reaction';

const App: React.FC = () => (
  <React.Suspense fallback={<div>loading...x</div>}>
    <Outlet />
  </React.Suspense>
);

const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Reaction /> },
      { path: '/onboard', element: <Onboard /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export const AppRoutes: React.FC = () => {
  const element = useRoutes([...publicRoutes]);
  return element;
};
