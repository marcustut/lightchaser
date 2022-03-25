import { Progress, Text, Grid, Loading, User, useTheme } from '@nextui-org/react';
import { Registration } from '@opening/server/dist/entity/registration';
import confetti from 'canvas-confetti';
import { FunctionComponent, useMemo, useState } from 'react';

import { trpc } from '@/lib/trpc';
import { levitating } from '@/utils/animation';
import { arrayEquals } from '@/utils/compare';
import { getRandomNumber } from '@/utils/random';

const satelliteColors: Record<
  string,
  'error' | 'primary' | 'secondary' | 'success' | 'warning' | 'gradient'
> = {
  kuchai: 'error',
  kepong: 'error',
  pj: 'primary',
  puchong: 'primary',
  rawang: 'secondary',
  serdang: 'secondary',
  seremban: 'success',
  setapak: 'success',
  'sg long': 'warning',
  usj: 'warning',
  klang: 'gradient',
  kajang: 'gradient',
};

export const Live: FunctionComponent = () => {
  const { theme } = useTheme();
  const [registrations, setRegistrations] = useState<Registration[]>();
  trpc.useSubscription(['registration', undefined], {
    onNext({ registrations: newRegistrations }) {
      setRegistrations((old) => {
        if (!old) return newRegistrations;
        else if (!arrayEquals(old, newRegistrations)) return newRegistrations;
        return old;
      });
      confetti({
        zIndex: 999,
        particleCount: getRandomNumber(80, 120),
        spread: getRandomNumber(50, 150),
        origin: { x: getRandomNumber(0, 1), y: getRandomNumber(0.5, 1) },
      });
    },
    onError(e) {
      console.error(e);
    },
  });

  const firstHalfRegistrations = useMemo(
    () => (registrations ? registrations.slice(0, registrations.length / 2) : []),
    [registrations]
  );
  const lastHalfRegistrations = useMemo(
    () =>
      registrations ? registrations.slice(registrations.length / 2, registrations.length) : [],
    [registrations]
  );

  if (!theme) throw new Error('theme is not provided');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Grid.Container
        justify="center"
        alignItems="center"
        css={{
          position: 'absolute',
          h: '100vh',
          padding: '$96',
          zIndex: 10,
        }}
      >
        <div
          style={{
            // background: theme.colors.accents1.value,
            position: 'relative',
            width: '100%',
            padding: '0px 64px 128px 64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {registrations ? (
            <Text
              h1
              size={180}
              css={{
                textAlign: 'center',
                textGradient: '45deg, $cyan400 -20%, #04dd01 100%',
              }}
            >
              {50 - registrations.length} seats remaining!
            </Text>
          ) : (
            <Loading size="xl" color="success" css={{ marginTop: '$12', marginBottom: '$16' }} />
          )}
          <Progress indeterminated value={50} color="success" status="success" shadow />
          <div
            style={{
              position: 'absolute',
              background: theme.colors.accents1.value,
              opacity: '50%',
              width: '100%',
              height: '100%',
              borderRadius: theme.radii.xl.value,
              zIndex: -1,
            }}
          />
        </div>
      </Grid.Container>
      <img
        src="/images/LightChaser_Logo.png"
        alt="LightChaser's logo"
        width={500}
        style={{
          position: 'absolute',
          bottom: theme.space.lg.value,
          left: theme.space.lg.value,
        }}
      />
      <img
        src="/images/LightChaser_LogoGreen.png"
        alt="LightChaser's logo"
        width={500}
        style={{
          position: 'absolute',
          bottom: theme.space.lg.value,
          right: theme.space.lg.value,
        }}
      />
      <img
        src="/images/LightChaser_BackgroundCentreScreen.png"
        alt="LightChaser's BG"
        width={4608}
        style={{
          opacity: '25%',
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          top: '0px',
          right: '0px',
        }}
      />
      {registrations && (
        <>
          {firstHalfRegistrations.map((reg) => (
            <User
              bordered
              color={satelliteColors[reg.satellite.trim().toLowerCase()]}
              key={`${reg.name}-${reg.phone_number}`}
              name={reg.name}
              src={`https://avatars.dicebear.com/api/open-peeps/${encodeURIComponent(
                reg.name
              )}.svg?mood[]=happy&backgroundColor=%23B5B5B5&`}
              css={{
                position: 'absolute',
                left: `${getRandomNumber(1, 2000)}px`,
                bottom: `${getRandomNumber(1, 1050)}px`,
                animation: `${levitating} ${getRandomNumber(5, 12)}s ease infinite`,
              }}
            >
              {reg.cg.split(' ').join('')} @{reg.satellite}
            </User>
          ))}
          {lastHalfRegistrations.map((reg) => (
            <User
              bordered
              color={satelliteColors[reg.satellite.trim().toLowerCase()]}
              key={`${reg.name}-${reg.phone_number}`}
              name={reg.name}
              src={`https://avatars.dicebear.com/api/open-peeps/${encodeURIComponent(
                reg.name
              )}.svg?mood[]=happy&backgroundColor=%23B5B5B5&`}
              css={{
                position: 'absolute',
                right: `${getRandomNumber(1, 2000)}px`,
                top: `${getRandomNumber(1, 1050)}px`,
                animation: `${levitating} 12s ease infinite`,
              }}
            >
              {reg.cg.split(' ').join('')} @{reg.satellite}
            </User>
          ))}
        </>
      )}
    </div>
  );
};
