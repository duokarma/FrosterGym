import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import { LoadingState } from '../ui/LoadingState';
import type { Permission } from '../../lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
}

export function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { session, loading: authLoading } = useAuth();
  const { hasPermission, loading: permLoading } = usePermissions();
  const location = useLocation();

  if (authLoading || permLoading) {
    return <LoadingState fullScreen message="Loading Froster Gym..." />;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
