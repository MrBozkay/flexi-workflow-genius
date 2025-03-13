
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  GitBranch, 
  Database, 
  Settings, 
  FileText, 
  BarChart, 
  Clock,
  Users,
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">FlexiFlow</h1>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 p-4 flex-1 overflow-auto">
        <div>
          <Button variant="default" className="w-full flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </Button>
          
          <nav className="space-y-1">
            <NavItem to="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
            <NavItem to="/workflows" icon={<GitBranch className="w-4 h-4" />} label="Workflows" />
            <NavItem to="/community" icon={<Users className="w-4 h-4" />} label="Community" />
            <NavItem to="/templates" icon={<FileText className="w-4 h-4" />} label="Templates" />
            <NavItem to="/executions" icon={<Clock className="w-4 h-4" />} label="Executions" />
          </nav>
        </div>
        
        <div>
          <h2 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">Integrations</h2>
          <nav className="space-y-1">
            <NavItem to="/integrations/ai" icon={<div className="w-4 h-4 flex items-center justify-center font-semibold text-xs text-primary">AI</div>} label="AI Models" />
            <NavItem to="/integrations/apis" icon={<Database className="w-4 h-4" />} label="API Connections" />
            <NavItem to="/integrations/analytics" icon={<BarChart className="w-4 h-4" />} label="Analytics" />
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <NavItem to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
      </div>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn("sidebar-item", isActive && "active")
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
