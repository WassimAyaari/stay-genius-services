import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

const moderatorAllowedPaths = [
  '/admin',
  '/admin/chat',
  '/admin/housekeeping',
  '/admin/maintenance',
  '/admin/security',
  '/admin/information-technology',
];

const staffAllowedPaths = [
  '/admin',
  '/admin/restaurants',
];

const AdminRoleGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, loading } = useUserRole();
  const location = useLocation();

  if (loading) return null;

  const path = location.pathname;

  if (role === 'moderator') {
    const allowed = moderatorAllowedPaths.some(p =>
      path === p || path.startsWith(p + '/')
    );
    if (!allowed) return <Navigate to="/admin" replace />;
  }

  if (role === 'staff') {
    const allowed = staffAllowedPaths.some(p =>
      path === p || path.startsWith(p + '/')
    );
    if (!allowed) return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminRoleGuard;
