import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NavLink } from '@/components/NavLink';
import { useTranslation } from 'react-i18next';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
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
  ChevronDown,
  Globe,
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
  defaultOpen?: boolean;
}

const navigationSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    ],
    defaultOpen: true,
  },
  {
    label: 'Guest Management',
    items: [
      { title: 'Guests', url: '/admin/guests', icon: Users, disabled: true },
      { title: 'Chat Manager', url: '/admin/chat', icon: MessageCircle },
      { title: 'Feedback', url: '/admin/feedback', icon: MessageSquare },
    ],
    defaultOpen: true,
  },
  {
    label: 'Services',
    items: [
      { title: 'Housekeeping', url: '/admin/housekeeping', icon: Trash2 },
      { title: 'Maintenance', url: '/admin/maintenance', icon: Wrench },
      { title: 'Security', url: '/admin/security', icon: Shield },
      { title: 'IT Support', url: '/admin/information-technology', icon: Wifi },
    ],
    defaultOpen: false,
  },
  {
    label: 'F&B',
    items: [
      { title: 'Restaurants', url: '/admin/restaurants', icon: Utensils },
    ],
    defaultOpen: false,
  },
  {
    label: 'Wellness',
    items: [
      { title: 'Spa', url: '/admin/spa', icon: Sparkles },
    ],
    defaultOpen: false,
  },
  {
    label: 'Entertainment',
    items: [
      { title: 'Events', url: '/admin/events', icon: PartyPopper },
      { title: 'Shops', url: '/admin/shops', icon: Store },
    ],
    defaultOpen: false,
  },
  {
    label: 'Hotel Info',
    items: [
      { title: 'Destinations', url: '/admin/destination-admin', icon: MapPin },
      { title: 'About Editor', url: '/admin/about', icon: FileText },
    ],
    defaultOpen: false,
  },
  {
    label: 'Administration',
    items: [
      { title: 'Demo Settings', url: '/admin/demo', icon: Settings },
    ],
    defaultOpen: false,
  },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { state } = useSidebar();
  const { i18n } = useTranslation();
  const isCollapsed = state === 'collapsed';
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationSections.forEach((section) => {
      initial[section.label] = section.defaultOpen ?? false;
    });
    return initial;
  });

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  const isSectionActive = (section: NavSection) => {
    return section.items.some((item) => isActive(item.url));
  };

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
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

      <SidebarContent className="px-2">
        {navigationSections.map((section) => {
          const sectionActive = isSectionActive(section);
          const isOpen = openSections[section.label] || sectionActive;

          return (
            <Collapsible
              key={section.label}
              open={isOpen}
              onOpenChange={() => toggleSection(section.label)}
            >
              <SidebarGroup className="py-0">
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex w-full cursor-pointer items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground">
                    <span>{section.label}</span>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          isOpen ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            tooltip={item.title}
                            disabled={item.disabled}
                            className="rounded-lg"
                          >
                            {item.disabled ? (
                              <span className="flex items-center gap-2 opacity-50 cursor-not-allowed px-2 py-1.5">
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
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarSeparator className="mx-0" />
        
        {/* Language Selector */}
        {!isCollapsed && (
          <div className="px-2 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <Globe className="h-4 w-4" />
                  <span>{currentLanguage.flag} {currentLanguage.name}</span>
                  <ChevronDown className="ml-auto h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

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
