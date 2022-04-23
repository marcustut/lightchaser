import { Container, CSS, Loading } from '@nextui-org/react';
import { FunctionComponent } from 'react';

interface LoadingPageProps {
  css?: CSS;
}

export const LoadingPage: FunctionComponent<LoadingPageProps> = ({ css }) => {
  return (
    <Container
      css={{ height: '100vh', ...css }}
      fluid
      display="flex"
      justify="center"
      alignItems="center"
    >
      <Loading />
    </Container>
  );
};
