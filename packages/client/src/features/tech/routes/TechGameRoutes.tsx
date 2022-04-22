import { Navigate, Route, Routes } from 'react-router-dom';

import { TechDashboard } from './Dashboard';
import { S1 } from './S1';
import { S1Calculator } from './S1/Calculator';
import { S2 } from './S2';
import { QRCamera } from './S2/QRCamera';
import { S3 } from './S3';

export const TechgameRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<TechDashboard />} />
      <Route path="S1" element={<S1 />} />
      <Route path="S1/Calculator" element={<S1Calculator />} />
      <Route path="S2" element={<S2 />} />
      <Route path="S2/qr" element={<QRCamera />} />
      <Route path="S3" element={<S3 />} />
      <Route path="*" element={<Navigate to={'.'} />} />
    </Routes>
  );
};
