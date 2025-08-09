import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Users, 
  Monitor, 
  Cpu, 
  HardDrive,
  Settings,
  Terminal,
  FolderOpen
} from "lucide-react";

interface ServerCardProps {
  server: {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'starting' | 'stopping';
    players: number;
    maxPlayers: number;
    map: string;
    port: number;
    cpu: number;
    ram: number;
    maxRam: number;
    uptime: string;
  };
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onOpenConsole: (id: string) => void;
  onOpenFiles: (id: string) => void;
  onOpenConfig: (id: string) => void;
}

export const ServerCard = ({ 
  server, 
  onStart, 
  onStop, 
  onRestart, 
  onOpenConsole, 
  onOpenFiles, 
  onOpenConfig 
}: ServerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-online';
      case 'offline': return 'text-offline';
      case 'starting': 
      case 'stopping': return 'text-loading';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-online';
      case 'offline': return 'bg-offline';
      case 'starting': 
      case 'stopping': return 'bg-loading';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="gaming-card animate-slide-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusBadge(server.status)} 
              ${server.status === 'online' ? 'animate-pulse-glow' : ''}`} />
            <div>
              <h3 className="font-semibold text-lg text-foreground">{server.name}</h3>
              <p className="text-sm text-muted-foreground">Port: {server.port}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(server.status)}>
            {server.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Server Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span>{server.players}/{server.maxPlayers} Players</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="w-4 h-4 text-primary" />
              <span>Map: {server.map}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-primary" />
              <span>CPU: {server.cpu}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4 text-primary" />
              <span>RAM: {server.ram}MB/{server.maxRam}MB</span>
            </div>
          </div>
        </div>

        {/* Resource Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>CPU Usage</span>
              <span>{server.cpu}%</span>
            </div>
            <Progress value={server.cpu} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Memory Usage</span>
              <span>{Math.round((server.ram / server.maxRam) * 100)}%</span>
            </div>
            <Progress value={(server.ram / server.maxRam) * 100} className="h-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="flex gap-2">
            {server.status === 'offline' ? (
              <Button 
                size="sm" 
                onClick={() => onStart(server.id)}
                className="bg-success hover:bg-success/80 text-success-foreground"
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onStop(server.id)}
                disabled={server.status === 'stopping'}
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onRestart(server.id)}
              disabled={server.status === 'offline' || server.status === 'starting'}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onOpenConsole(server.id)}
            >
              <Terminal className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onOpenFiles(server.id)}
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onOpenConfig(server.id)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Uptime */}
        {server.status === 'online' && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Uptime: {server.uptime}
          </div>
        )}
      </CardContent>
    </Card>
  );
};