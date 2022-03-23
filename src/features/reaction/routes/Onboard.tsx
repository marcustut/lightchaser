import { Container, Row, Progress, Image, Text } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';

const SECONDS = 60;

export const Onboard: FunctionComponent = () => {
  const [seconds, setSeconds] = useState(SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid css={{ padding: '$14 $14', maxW: '100%', height: '100vh' }}>
      <Progress css={{ width: '100%' }} color="error" value={(seconds / SECONDS) * 100} />
      <Row
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Image
          src="https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"
          width="600px"
          height="600px"
        />
        <Text h1 css={{ fontSize: '150px' }}>
          Scan Me!
        </Text>
      </Row>
      <Text h1 css={{ fontSize: '150px', position: 'absolute', right: '$16', bottom: '$8' }}>
        {seconds}
      </Text>
    </Container>
  );
};
