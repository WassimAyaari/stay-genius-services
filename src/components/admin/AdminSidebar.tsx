import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  ConciergeBell,
  Utensils,
  Sparkles,
  PartyPopper,
  Store,
  Trash2,
  Wrench,
  Wifi,
  MapPin,
  FileText,
  MessageSquare,
  LogOut,
  Hotel,
  Shield,
  MessageCircle,
  Settings,
} from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    label: 'Front Office',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
      { title: 'Guests', url: '/admin/guests', icon: Users, disabled: true },
      { title: 'Rooms', url: '/admin/rooms', icon: BedDouble, disabled: true },
      { title: 'Reception', url: '/admin/reception', icon: ConciergeBell, disabled: true },
    ],
  },
  {
    label: 'Services',
    items: [
      { title: 'Restaurants', url: '/admin/restaurants', icon: Utensils },
      { title: 'Spa', url: '/admin/spa', icon: Sparkles },
      { title: 'Events', url: '/admin/events', icon: PartyPopper },
      { title: 'Shops', url: '/admin/shops', icon: Store },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Security', url: '/admin/security', icon: Shield },
      { title: 'Housekeeping', url: '/admin/housekeeping', icon: Trash2 },
      { title: 'Maintenance', url: '/admin/maintenance', icon: Wrench },
      { title: 'IT Support', url: '/admin/information-technology', icon: Wifi },
    ],
  },
  {
    label: 'Content',
    items: [
      { title: 'Destinations', url: '/admin/destination-admin', icon: MapPin },
      { title: 'About Editor', url: '/admin/about', icon: FileText },
      { title: 'Feedback', url: '/admin/feedback', icon: MessageSquare },
      { title: 'Messages', url: '/admin/chat', icon: MessageCircle },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Demo Settings', url: '/admin/demo', icon: Settings },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  const userInitials = userData 
    ? `${userData.first_name?.[0] || ''}${userData.last_name?.[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'A';

  const userName = userData 
    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    : user?.email || 'Admin';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hotel className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Admin Panel</span>
              <span className="text-xs text-sidebar-foreground/60">Hotel Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      disabled={item.disabled}
                    >
                      {item.disabled ? (
                        <span className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </span>
                      ) : (
                        <NavLink to={item.url} end={item.url === '/admin'}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarSeparator className="mx-0" />
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.profile_image || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {userName}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {user?.email}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
