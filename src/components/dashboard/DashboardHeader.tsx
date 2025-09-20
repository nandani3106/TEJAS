import { useState } from "react";
import { Bell, Settings, User, Shield, MapPin, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  activeAlerts: number;
}

const DashboardHeader = ({ activeAlerts }: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  setInterval(() => setCurrentTime(new Date()), 1000);

  return (
    <header className="bg-dashboard-header border-b border-border panel-shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TrafficFlow AI</h1>
                <p className="text-sm text-muted-foreground">Real-Time Traffic Management</p>
              </div>
            </div>
          </div>

          {/* Center - System Status */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm text-foreground">System Online</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-mono text-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Alerts Bell */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {activeAlerts > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs min-w-5 h-5 p-0 flex items-center justify-center"
                >
                  {activeAlerts}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden md:inline text-sm">Operator</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Traffic Control</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;