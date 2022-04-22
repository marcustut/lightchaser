import { Icon } from '@iconify/react';
import { Button, Text } from '@nextui-org/react';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth, useSigninCheck } from 'reactfire';

import { ErrorPage, LoadingPage } from '@/components';
import { AuthModal, WelcomeModal } from '@/features/auth';
import { fade } from '@/utils/animation';

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(false);
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { status, data } = useSigninCheck();
  const auth = useAuth();

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
            <Button
              flat
              auto
              color="success"
              css={{
                position: 'fixed',
                bottom: '$8',
                right: '$8',
                zIndex: '$1',
                animation: `${
                  !scrolling
                    ? fade({ x: 0, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1 })
                    : fade({ x: 0, y: 0, opacity: 1 }, { x: 0, y: 100, opacity: 0 })
                } 0.5s ease forwards`,
              }}
              onClick={() => setOpen(true)}
            >
              <Icon icon="heroicons-outline:login" width={20} style={{ marginRight: 4 }} />
              <Text color="success" weight="semibold">
                Login
              </Text>
            </Button>
          )}
          <WelcomeModal open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
          <AuthModal open={open} onClose={() => setOpen(false)} />
        </>
      ) : (
        <Button
          flat
          auto
          color="error"
          css={{
            position: 'fixed',
            top: '$8',
            right: '$8',
            zIndex: '$1',
            animation: `${
              !scrolling
                ? fade({ x: 0, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1 })
                : fade({ x: 0, y: 0, opacity: 1 }, { x: 0, y: 100, opacity: 0 })
            } 0.5s ease forwards`,
          }}
          onClick={() =>
            auth.signOut().then(() => toast('successfully signed out', { type: 'success' }))
          }
        >
          <Icon icon="heroicons-outline:logout" width={20} style={{ marginRight: 4 }} />
          <Text color="error" weight="semibold">
            Log Out
          </Text>
        </Button>
      )}
      {children}
    </>
  );
};
