import { createTheme, NextUIProvider } from '@nextui-org/react';
import { AppRouter } from '@opening/server/dist/index';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import { FunctionComponent, Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { trpc } from '@/lib/trpc';

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

  return (
    <Suspense fallback={<div>TODO fallback</div>}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider theme={createTheme({ type: 'dark' })}>
            <BrowserRouter>{children}</BrowserRouter>
          </NextUIProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </Suspense>
  );
};
