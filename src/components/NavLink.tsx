import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends RouterNavLinkProps {
  activeClassName?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  className, 
  activeClassName = 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
  ...props 
}) => {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(className, isActive && activeClassName)
      }
      {...props}
    />
  );
};

export default NavLink;
