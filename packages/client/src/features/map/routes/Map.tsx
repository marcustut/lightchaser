import { FunctionComponent } from 'react';

import { AppLayout } from '@/components';
import { HomePage } from '@/features/landing';

export const Map: FunctionComponent = () => {
  return (
    <AppLayout>
      <HomePage topBar={false} skipStory />
    </AppLayout>
  );
};
