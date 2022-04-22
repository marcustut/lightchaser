import { NextUIProvider } from '@nextui-org/react';
import { AppRouter } from '@opening/server/dist/index';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import { getAuth } from 'firebase/auth';
import { FunctionComponent, Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useFirebaseApp } from 'reactfire';

import { PWAReloadPrompt, LoadingPage } from '@/components';
import { AuthWrapper } from '@/features/auth';
import { trpc } from '@/lib/trpc';
import { theme } from '@/utils/theme';

import 'react-toastify/dist/ReactToastify.css';

function getEndingLink() {
  const client = createWSClient({
    url: import.meta.env.VITE_TRPC_URL,
  });
  return wsLink<AppRouter>({
    client,
  });
}

export const AppProvider: FunctionComponent = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [getEndingLink()],
    })
  );
  const auth = getAuth(useFirebaseApp());

  useEffect(() => {
    auth.useDeviceLanguage();
  }, [auth]);

  return (
    <Suspense fallback={<LoadingPage />}>
      <AuthProvider sdk={auth}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <NextUIProvider theme={theme}>
              <AuthWrapper>
                <BrowserRouter>{children}</BrowserRouter>
              </AuthWrapper>
              <ToastContainer position="top-center" theme="dark" />
              <PWAReloadPrompt />
            </NextUIProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </AuthProvider>
    </Suspense>
  );
};
