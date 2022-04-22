import { Icon } from '@iconify/react';
import { Button, Grid, Text } from '@nextui-org/react';
import { FunctionComponent, CSSProperties, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface AppBarButtonProps {
  href: string;
  icon: string;
  iconRender?: (defaultStyle: CSSProperties) => JSX.Element;
  text: string;
  textRender?: () => JSX.Element;
}

const AppBarButton: FunctionComponent<AppBarButtonProps> = ({
  href,
  icon,
  iconRender,
  text,
  textRender,
}) => {
  const { pathname } = useLocation();
  const [active] = useState<boolean>(pathname === href);
  const [iconKey] = useState<string>(() => {
    if (icon.includes('outline') && active) return icon.replace('outline', 'solid');
    return icon;
  });
  const iconStyle: CSSProperties = { width: '1.5rem', height: '1.5rem' };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Button as="a" href={href} auto light color="primary" css={{ height: '60px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {iconRender ? iconRender(iconStyle) : <Icon icon={iconKey} style={iconStyle} />}
        {textRender ? (
          textRender()
        ) : (
          <Text color="primary" weight={active ? 'bold' : 'medium'}>
            {text}
          </Text>
        )}
      </div>
    </Button>
  );
};
interface BottomAppBarProps {
  options?: AppBarButtonProps[];
}

export const BottomAppBar: FunctionComponent<BottomAppBarProps> = ({
  options = [
    {
      href: '/interactive',
      icon: 'heroicons-outline:lightning-bolt',
      text: 'Reaction',
    },
    {
      href: '/timer',
      icon: 'heroicons-outline:clock',
      text: 'Timer',
    },
    {
      href: '/map',
      icon: 'heroicons-outline:map',
      text: 'Map',
    },
    {
      href: '/help',
      icon: 'heroicons-outline:phone-outgoing',
      text: 'Help',
    },
  ],
}) => {
  return (
    <Grid.Container
      justify="space-evenly"
      css={{
        backgroundColor: '$background',
        position: 'fixed',
        paddingTop: '$6',
        paddingBottom: '$6',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      {options.map((o, idx) => (
        <Grid key={idx}>
          <AppBarButton {...o} />
        </Grid>
      ))}
    </Grid.Container>
  );
};
