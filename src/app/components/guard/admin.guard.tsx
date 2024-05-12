import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
type AuthGuardProps = {
    children: ReactNode;
  };

const AdminGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [user, setUser] = useState({})

  if (!user || user.role !== 'admin') {
    // Redirect to a different page (e.g., 403 Forbidden) or the login page
    router.push('/forbidden');
    return null;
  }

  return children;
};

export default AdminGuard;
