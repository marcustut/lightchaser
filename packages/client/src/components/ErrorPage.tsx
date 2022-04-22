import { Container, Text } from '@nextui-org/react';
import { FunctionComponent } from 'react';

type ErrorPageProps = {
  description: string;
};

export const ErrorPage: FunctionComponent<ErrorPageProps> = ({ description, children }) => {
  return (
    <Container css={{ height: '100vh' }} fluid display="flex" justify="center" alignItems="center">
      {children ? children : <Text color="error">{description}</Text>}
    </Container>
  );
};
