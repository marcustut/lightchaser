import { FunctionComponent } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Home, Timer } from '@/features/admin';

export const AdminRoutes: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timer" element={<Timer />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
