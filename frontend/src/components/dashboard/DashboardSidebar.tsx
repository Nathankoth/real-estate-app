import { NavLink, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  BookOpen, 
  Calculator, 
  Image, 
  Box, 
  FolderOpen,
  Bot,
  TrendingUp,
  Palette,
  Sparkles,
  Shield
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Guide',
    url: '/dashboard/guide',
    icon: BookOpen,
  },
  {
    title: 'AI Assistant',
    url: '/dashboard/ai-guide',
    icon: Bot,
  },
  {
    title: 'ROI Calculator',
    url: '/dashboard/roi',
    icon: Calculator,
  },
  {
    title: 'Market Analytics',
    url: '/dashboard/market-analytics',
    icon: TrendingUp,
  },
  {
    title: 'Design Tools',
    url: '/dashboard/design-tools',
    icon: Palette,
  },
  {
    title: '2D Generator',
    url: '/dashboard/2d-generator',
    icon: Image,
  },
  {
    title: '3D Rendering',
    url: '/dashboard/3d-generator',
    icon: Box,
  },
  {
    title: 'AI Visualization',
    url: '/dashboard/ai-visualization',
    icon: Sparkles,
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: FolderOpen,
  },
  {
    title: 'Security & Reliability',
    url: '/dashboard/security',
    icon: Shield,
  },
  {
    title: 'FastAPI ROI',
    url: '/dashboard/fastapi-roi',
    icon: Calculator,
  },
  {
    title: 'FastAPI Design',
    url: '/dashboard/fastapi-design',
    icon: Palette,
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    return isActive(path) 
      ? 'bg-accent text-accent-foreground font-medium' 
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';
  };

  return (
    <Sidebar className={state === 'collapsed' ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="luxury-gradient p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {state !== 'collapsed' && <span className="text-xl font-bold">Vista Forge</span>}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== 'collapsed' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t mt-auto">
          <SidebarTrigger className="w-full justify-center" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}