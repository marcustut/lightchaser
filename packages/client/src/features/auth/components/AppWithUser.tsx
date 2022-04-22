import { Loading } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { FunctionComponent, Suspense, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

type AppWithUserProps = {
  firebaseUser: User;
};

export const AppWithUser: FunctionComponent<AppWithUserProps> = ({ firebaseUser }) => {
  const [user] = useState(firebaseUser);
  return (
    <Suspense fallback={<Loading />}>
      <Outlet context={{ user }} />
    </Suspense>
  );
};

type ContextType = { user: User };

export const useAuth = () => useOutletContext<ContextType>();
