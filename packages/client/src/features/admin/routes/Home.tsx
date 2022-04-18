import { FunctionComponent } from 'react';

import { AppLayout } from '@/components';

export const Home: FunctionComponent = () => {
  return (
    <AppLayout
      bottomAppBarProps={{
        options: [
          {
            href: '/admin/timer',
            icon: 'heroicons-outline:clock',
            text: 'Timer (Admin)',
          },
          {
            href: '/admin/help',
            icon: 'heroicons-outline:phone-outgoing',
            text: 'Help (Admin)',
          },
        ],
      }}
    >
      This is the admin page
    </AppLayout>
  );
};
