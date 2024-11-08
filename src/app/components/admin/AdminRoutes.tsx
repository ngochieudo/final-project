'use client'; 

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Unauthorized from '../Unauthorized';
import Loading from '../Loading';


interface AdminRouteProps {
  component: React.ComponentType<any>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return <Loading/>;
  }

  if (session && !session.user.isAdmin) {
    return <Unauthorized />;
  }

  return session && session.user.isAdmin ? <Component /> : null;
};

export default AdminRoute;
