// components/AuthGuard.js

import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type AuthGuardProps = {
    children: ReactNode;
  };

const AuthGuard = ({children}: AuthGuardProps ) => {
  const router = useRouter();

  // Replace this with your authentication logic
  const isAuthenticated = true; // Implement your authentication check here

  if (!isAuthenticated) {
    // Redirect to the login page or another page of your choice
    router.push('/login');
    return null;
  }

  return children;
};

export default AuthGuard;
