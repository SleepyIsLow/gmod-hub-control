import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Gamepad2, 
  Users, 
  Activity, 
  Bell, 
  Settings,
  LogOut,
  RefreshCw
} from "lucide-react";

interface GamePanelHeaderProps {
  totalServers: number;
  onlineServers: number;
  totalPlayers: number;
  user: {
    name: string;
    role: 'admin' | 'moderator' | 'viewer';
  };
  onRefresh: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export const GamePanelHeader = ({ 
  totalServers, 
  onlineServers, 
  totalPlayers, 
  user,
  onRefresh,
  onSettings,
  onLogout
}: GamePanelHeaderProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'moderator': return 'bg-warning text-warning-foreground';
      case 'viewer': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary glow-primary" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                GMod Server Panel
              </h1>
              <p className="text-muted-foreground">Garry's Mod Server Management</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-online" />
                <span className="text-2xl font-bold text-online">{onlineServers}</span>
                <span className="text-muted-foreground">/ {totalServers}</span>
              </div>
              <p className="text-xs text-muted-foreground">Servers Online</p>
            </div>
            
            <div className="w-px h-8 bg-border" />
            
            <div className="text-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-primary">{totalPlayers}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Players</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button size="sm" variant="ghost">
              <Bell className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <Badge variant="outline" className={getRoleColor(user.role)}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" onClick={onSettings}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};