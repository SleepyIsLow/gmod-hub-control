import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Send, 
  Trash2, 
  Download, 
  X,
  Minimize2,
  Maximize2
} from "lucide-react";

interface ConsolePanelProps {
  serverId: string;
  serverName: string;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'command';
    message: string;
  }>;
  onSendCommand: (serverId: string, command: string) => void;
  onClearLogs: (serverId: string) => void;
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const ConsolePanel = ({ 
  serverId, 
  serverName, 
  logs, 
  onSendCommand, 
  onClearLogs, 
  onClose,
  isMinimized = false,
  onToggleMinimize
}: ConsolePanelProps) => {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSendCommand = () => {
    if (command.trim()) {
      onSendCommand(serverId, command);
      
      // Add to command history
      setCommandHistory(prev => [...prev.slice(-49), command]); // Keep last 50 commands
      setHistoryIndex(-1);
      setCommand("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'command': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return 'bg-destructive';
      case 'warning': return 'bg-warning';
      case 'command': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverName}_console_${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 gaming-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{serverName} Console</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={onToggleMinimize}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="gaming-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{serverName} Console</h3>
            <Badge variant="outline" className="text-primary">
              Live
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={exportLogs}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onClearLogs(serverId)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            {onToggleMinimize && (
              <Button size="sm" variant="ghost" onClick={onToggleMinimize}>
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Console Output */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 font-mono text-sm">
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground text-xs min-w-[60px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${getLevelBadge(log.level)}`} />
                <span className={`${getLevelColor(log.level)} break-all`}>
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-muted-foreground text-center py-8">
                No console output yet. Server logs will appear here.
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter console command..."
                className="font-mono bg-input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ↑↓ History
              </div>
            </div>
            <Button 
              onClick={handleSendCommand}
              disabled={!command.trim()}
              className="bg-primary hover:bg-primary/80"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Commands: status, say [message], kick [player], ban [player], changelevel [map]
          </div>
        </div>
      </CardContent>
    </Card>
  );
};