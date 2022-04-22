import { Navigate, Route, Routes } from 'react-router-dom';

import { Interaction } from './Interaction';
import { L5Screen } from './L5';
import { InteractiveReaction } from './Reaction';

export const InteractiveRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InteractiveReaction />} />
      <Route path="/L5" element={<L5Screen />} />
      <Route path="/interaction" element={<Interaction />} />
      <Route path="*" element={<Navigate to={'.'} />} />
    </Routes>
  );
};
