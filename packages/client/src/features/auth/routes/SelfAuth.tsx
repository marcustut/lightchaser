import { signInAnonymously } from 'firebase/auth';
import { FunctionComponent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from 'reactfire';

import { LoadingPage } from '@/components';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';

export const SelfAuth: FunctionComponent = () => {
  const { identityCardNumber } = useParams();
  const navigation = useNavigate();
  const auth = useAuth();
  const user = trpc.useQuery(['user.get', { identityCardNumber }]);
  const { setUser } = useUser();

  useEffect(() => {
    if (!identityCardNumber) {
      navigation('/');
      return;
    }
  }, [identityCardNumber, navigation]);

  useEffect(() => {
    if (user.isFetching || !user.data) return;
    signInAnonymously(auth)
      .then(() => {
        if (!user.data) {
          toast('unable to sign in', { type: 'error' });
          return;
        }
        setUser(user.data);
        toast('signed in successfully', { type: 'success' });
      })
      .catch((err) => {
        console.error(err);
        toast('unable to sign in', { type: 'error' });
      });
  }, [auth, setUser, user]);

  return <LoadingPage />;
};
