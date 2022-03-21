import { Container, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

export const Reaction: React.FC = () => {
  const [identities] = useState([
    '大能的勇士',
    '天父的儿女',
    '属灵继承者',
    '历史缔造者',
    '被拣选的使者',
    '神国筑建者',
    '基督拥趸者',
  ]);
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
      <Text
        css={{
          textAlign: 'center',
          fontSize: '14rem',
          letterSpacing: '$wide',
          fontFamily: 'DOUYU',
        }}
        className="neon"
      >
        {identity}
      </Text>
    </Container>
  );
};
