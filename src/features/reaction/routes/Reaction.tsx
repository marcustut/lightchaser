import { Container, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

export const Reaction: React.FC = () => {
  const [identities] = useState(['大能的勇士', '上帝的爱子', '属灵继承者', '历史缔造者']);
  const [identity, setIdentity] = useState(
    identities[Math.floor(Math.random() * identities.length)]
  );

  useEffect(() => {
    const interval = setInterval(
      () => setIdentity(identities[Math.floor(Math.random() * identities.length)]),
      1000
    );
    return () => clearInterval(interval);
  }, [identities]);

  return (
    <Container fluid display="flex" justify="center" alignItems="center" css={{ height: '100vh' }}>
      <Text h1 css={{ fontSize: '240px' }}>
        {identity}
      </Text>
    </Container>
  );
};
