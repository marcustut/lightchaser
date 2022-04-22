import { Icon } from '@iconify/react';
import { Button, Text } from '@nextui-org/react';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth, useSigninCheck } from 'reactfire';

import { ErrorPage, LoadingPage } from '@/components';
import { AuthModal, WelcomeModal } from '@/features/auth';
import { fade } from '@/utils/animation';

interface AuthButtonProps {
  scrolling: boolean;
  variant: 'login' | 'logout';
  onClick?: () => void;
}

const AuthButton: FunctionComponent<AuthButtonProps> = ({ scrolling, onClick, variant }) => {
  const auth = useAuth();

  return (
    <Button
      flat
      auto
      color={variant === 'login' ? 'success' : 'error'}
      css={{
        position: 'fixed',
        top: variant === 'logout' ? '$8' : 'unset',
        bottom: variant === 'login' ? '$8' : 'unset',
        right: '$8',
        zIndex: '$1',
        animation: `${
          !scrolling
            ? fade({ x: 0, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1 })
            : fade({ x: 0, y: 0, opacity: 1 }, { x: 0, y: 100, opacity: 0 })
        } 0.5s ease forwards`,
      }}
      onClick={
        variant === 'logout'
          ? () => auth.signOut().then(() => toast('successfully signed out', { type: 'success' }))
          : onClick
          ? onClick
          : () => {}
      }
    >
      <Icon
        icon={`heroicons-outline:${variant == 'login' ? 'login' : 'logout'}`}
        width={20}
        style={{ marginRight: 4 }}
      />
      <Text color={variant === 'login' ? 'success' : 'error'} weight="semibold">
        {variant === 'login' ? 'Login' : 'Log Out'}
      </Text>
    </Button>
  );
};

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(false);
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { status, data } = useSigninCheck();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setWelcomeOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [open]);

  const scrollHandler = useCallback(() => {
    setScrolling(true);
    if (!timer) clearTimeout(timer);
    setTimer(setTimeout(() => setScrolling(false), 1000));
  }, [timer]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  if (status === 'loading') return <LoadingPage />;
  if (status === 'error')
    return <ErrorPage description="An error occured in loading Firebase Auth" />;
  if (!children) throw new Error('children must be provided');

  return (
    <>
      {!data.signedIn ? (
        <>
          {!open && (
            <AuthButton variant="login" scrolling={scrolling} onClick={() => setOpen(true)} />
          )}
          <WelcomeModal open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
          <AuthModal open={open} onClose={() => setOpen(false)} />
        </>
      ) : (
        <AuthButton variant="logout" scrolling={scrolling} />
      )}
      {children}
    </>
  );
};
