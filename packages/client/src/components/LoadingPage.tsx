import { Container, Loading } from '@nextui-org/react';
import { FunctionComponent } from 'react';

export const LoadingPage: FunctionComponent = () => {
  return (
    <Container css={{ height: '100vh' }} fluid display="flex" justify="center" alignItems="center">
      <Loading />
    </Container>
  );
};
