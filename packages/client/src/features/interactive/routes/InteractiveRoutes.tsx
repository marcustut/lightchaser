import { Navigate, Route, Routes } from 'react-router-dom';

import { Interaction } from './Interaction';
import { L5Screen } from './L5';
import { QRCamera } from './QRCamera';
import { InteractiveReaction } from './Reaction';

export const InteractiveRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<InteractiveReaction />} />
      <Route path="/L5" element={<L5Screen />} />
      <Route path="/qr" element={<QRCamera />} />
      <Route path="/interaction" element={<Interaction />} />
      <Route path="*" element={<Navigate to={'.'} />} />
    </Routes>
  );
};
