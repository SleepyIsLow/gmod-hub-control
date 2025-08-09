import { useState, useEffect } from "react";
import { GamePanelHeader } from "@/components/gaming/GamePanelHeader";
import { ServerCard } from "@/components/gaming/ServerCard";
import { ConsolePanel } from "@/components/gaming/ConsolePanel";
import { FileManager } from "@/components/gaming/FileManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Zap } from "lucide-react";

// Types
type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping';

interface Server {
  id: string;
  name: string;
  status: ServerStatus;
  players: number;
  maxPlayers: number;
  map: string;
  port: number;
  cpu: number;
  ram: number;
  maxRam: number;
  uptime: string;
}

// Mock data for demonstration
const mockServers: Server[] = [
  {
    id: "srv1",
    name: "DarkRP Main Server",
    status: "online",
    players: 24,
    maxPlayers: 32,
    map: "rp_downtown_v4c_v2",
    port: 27015,
    cpu: 45,
    ram: 2048,
    maxRam: 4096,
    uptime: "2d 14h 32m"
  },
  {
    id: "srv2", 
    name: "TTT Fun Server",
    status: "online",
    players: 16,
    maxPlayers: 20,
    map: "ttt_minecraft_b5",
    port: 27016,
    cpu: 32,
    ram: 1536,
    maxRam: 2048,
    uptime: "1d 8h 15m"
  },
  {
    id: "srv3",
    name: "Sandbox Creative",
    status: "offline",
    players: 0,
    maxPlayers: 16,
    map: "gm_flatgrass",
    port: 27017,
    cpu: 0,
    ram: 0,
    maxRam: 1024,
    uptime: "0h 0m"
  }
];

const mockLogs = [
  { timestamp: new Date().toISOString(), level: "info" as const, message: "Server started successfully" },
  { timestamp: new Date().toISOString(), level: "info" as const, message: "Loading map: rp_downtown_v4c_v2" },
  { timestamp: new Date().toISOString(), level: "warning" as const, message: "Player connection timeout: Steam_123456" },
  { timestamp: new Date().toISOString(), level: "command" as const, message: "Admin executed: say Welcome to DarkRP!" },
  { timestamp: new Date().toISOString(), level: "info" as const, message: "Player 'John_Doe' connected (24/32)" }
];

const mockFiles = [
  { name: "addons", type: "folder" as const, lastModified: "2024-01-15", permissions: "rwx" },
  { name: "cfg", type: "folder" as const, lastModified: "2024-01-14", permissions: "rwx" },
  { name: "lua", type: "folder" as const, lastModified: "2024-01-13", permissions: "rwx" },
  { name: "server.cfg", type: "file" as const, size: 2048, lastModified: "2024-01-15", permissions: "rw-" },
  { name: "srcds_run", type: "file" as const, size: 4096, lastModified: "2024-01-10", permissions: "rwx" },
];

const Index = () => {
  const [servers, setServers] = useState(mockServers);
  const [activeConsole, setActiveConsole] = useState<string | null>(null);
  const [activeFileManager, setActiveFileManager] = useState<string | null>(null);
  const [consoleMinimized, setConsoleMinimized] = useState(false);
  const [logs, setLogs] = useState<{[key: string]: any[]}>({"srv1": mockLogs});

  const user = {
    name: "Admin User",
    role: "admin" as const
  };

  const handleServerStart = (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: "starting" as const } : server
    ));
    
    // Simulate server starting
    setTimeout(() => {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: "online" as const, uptime: "0h 1m" } : server
      ));
    }, 3000);
  };

  const handleServerStop = (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: "stopping" as const } : server
    ));
    
    setTimeout(() => {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: "offline" as const, uptime: "0h 0m", players: 0 } : server
      ));
    }, 2000);
  };

  const handleServerRestart = (id: string) => {
    handleServerStop(id);
    setTimeout(() => handleServerStart(id), 3000);
  };

  const handleSendCommand = (serverId: string, command: string) => {
    const newLog = {
      timestamp: new Date().toISOString(),
      level: "command" as const,
      message: `> ${command}`
    };
    
    setLogs(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), newLog]
    }));
  };

  const onlineServers = servers.filter(s => s.status === "online").length;
  const totalPlayers = servers.reduce((sum, s) => sum + s.players, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <GamePanelHeader
          totalServers={servers.length}
          onlineServers={onlineServers}
          totalPlayers={totalPlayers}
          user={user}
          onRefresh={() => window.location.reload()}
          onSettings={() => {}}
          onLogout={() => {}}
        />

        {/* Quick Actions */}
        <div className="flex gap-4 mb-6">
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Server
          </Button>
          <Button variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Discover Servers
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Servers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {servers.map(server => (
              <ServerCard
                key={server.id}
                server={server}
                onStart={handleServerStart}
                onStop={handleServerStop}
                onRestart={handleServerRestart}
                onOpenConsole={(id) => setActiveConsole(id)}
                onOpenFiles={(id) => setActiveFileManager(id)}
                onOpenConfig={(id) => {}}
              />
            ))}
          </div>

          {/* Console Panel */}
          {activeConsole && (
            <div className="h-96">
              <ConsolePanel
                serverId={activeConsole}
                serverName={servers.find(s => s.id === activeConsole)?.name || "Unknown"}
                logs={logs[activeConsole] || []}
                onSendCommand={handleSendCommand}
                onClearLogs={(id) => setLogs(prev => ({ ...prev, [id]: [] }))}
                onClose={() => setActiveConsole(null)}
                isMinimized={consoleMinimized}
                onToggleMinimize={() => setConsoleMinimized(!consoleMinimized)}
              />
            </div>
          )}

          {/* File Manager */}
          {activeFileManager && (
            <div className="h-96">
              <FileManager
                serverId={activeFileManager}
                serverName={servers.find(s => s.id === activeFileManager)?.name || "Unknown"}
                currentPath="/"
                files={mockFiles}
                onNavigate={() => {}}
                onUpload={() => {}}
                onDownload={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                onCreateFolder={() => {}}
                onClose={() => setActiveFileManager(null)}
              />
            </div>
          )}

          {/* Empty State */}
          {servers.length === 0 && (
            <Card className="gaming-card">
              <CardContent className="text-center py-12">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Servers Found</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Auto-Discover Servers" to scan for Garry's Mod installations
                </p>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Discovery
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
