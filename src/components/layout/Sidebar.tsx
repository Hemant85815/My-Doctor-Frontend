import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Calendar, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  Stethoscope,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'doctor', 'staff'] },
  { icon: CalendarPlus, label: 'Register Appointment', path: '/appointments/new', roles: ['admin', 'staff'] },
  { icon: Calendar, label: 'Calendar', path: '/calendar', roles: ['admin', 'doctor', 'staff'] },
  { icon: Users, label: 'Patient Management', path: '/patients', roles: ['admin', 'doctor', 'staff'] },
  { icon: ClipboardList, label: 'Appointment Management', path: '/appointments', roles: ['admin', 'doctor', 'staff'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin', 'doctor', 'staff'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-5 border-b border-sidebar-border",
        collapsed && "justify-center px-4"
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary">
          <Stethoscope className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-semibold text-sidebar-foreground">MediCare</h1>
            <p className="text-xs text-sidebar-muted">Health Management</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border hover:bg-sidebar-primary hover:text-sidebar-primary-foreground z-50"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "nav-item",
              isActive && "active",
              collapsed && "justify-center px-3"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        collapsed && "px-2"
      )}>
        {user && (
          <div className={cn(
            "flex items-center gap-3 mb-3 px-2",
            collapsed && "justify-center px-0"
          )}>
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <span className="text-sidebar-primary-foreground font-medium text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
            {!collapsed && (
              <div className="animate-fade-in min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-muted capitalize">{user.role}</p>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={logout}
          className={cn(
            "nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-3"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
