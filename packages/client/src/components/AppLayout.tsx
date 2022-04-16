import { Container, CSS } from '@nextui-org/react';
import { ComponentProps, FunctionComponent } from 'react';

import { BottomAppBar } from './BottomAppBar';

interface AppLayoutProps {
  css?: CSS;
  bottomAppBarProps?: ComponentProps<typeof BottomAppBar>;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  css,
  bottomAppBarProps,
  children,
}) => {
  return (
    <Container css={css}>
      {children}
      <BottomAppBar {...bottomAppBarProps} />
    </Container>
  );
};
