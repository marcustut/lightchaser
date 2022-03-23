import { createTheme, NextUIProvider } from '@nextui-org/react';
import { FunctionComponent, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const AppProvider: FunctionComponent = ({ children }) => {
  return (
    <Suspense fallback={<div>TODO fallback</div>}>
      <NextUIProvider theme={createTheme({ type: 'dark' })}>
        <BrowserRouter>{children}</BrowserRouter>
      </NextUIProvider>
    </Suspense>
  );
};
