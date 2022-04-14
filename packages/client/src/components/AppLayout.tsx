import { Container, CSS } from '@nextui-org/react';
import { FunctionComponent } from 'react';

import { BottomAppBar } from './BottomAppBar';

interface AppLayoutProps {
  css?: CSS;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ css, children }) => {
  return (
    <Container css={css}>
      {children}
      <BottomAppBar />
    </Container>
  );
};
