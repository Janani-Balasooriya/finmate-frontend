import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/auth');
    }
  }, [navigate]);

  // Show children only if authenticated
  if (!auth.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
