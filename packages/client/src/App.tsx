import { FunctionComponent } from 'react';

import { AppProvider } from './providers/AppProvider';
import { AppRoutes } from './routes';

const App: FunctionComponent = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
