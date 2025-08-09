import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FolderOpen, 
  File, 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  Plus,
  X,
  ChevronLeft,
  Home,
  Search
} from "lucide-react";

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: string;
  permissions: string;
}

interface FileManagerProps {
  serverId: string;
  serverName: string;
  currentPath: string;
  files: FileItem[];
  onNavigate: (path: string) => void;
  onUpload: (files: FileList) => void;
  onDownload: (fileName: string) => void;
  onDelete: (fileName: string) => void;
  onEdit: (fileName: string) => void;
  onCreateFolder: (folderName: string) => void;
  onClose: () => void;
}

export const FileManager = ({
  serverId,
  serverName,
  currentPath,
  files,
  onNavigate,
  onUpload,
  onDownload,
  onDelete,
  onEdit,
  onCreateFolder,
  onClose
}: FileManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderOpen className="w-4 h-4 text-primary" />;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'cfg':
      case 'txt':
      case 'log':
        return <File className="w-4 h-4 text-warning" />;
      case 'lua':
        return <File className="w-4 h-4 text-primary" />;
      default:
        return <File className="w-4 h-4 text-foreground" />;
    }
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  return (
    <Card className="gaming-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{serverName} File Manager</h3>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onNavigate('/')}
          >
            <Home className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onNavigate(pathParts.slice(0, -1).join('/') || '/')}
            disabled={pathParts.length === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            /{currentPath}
          </Badge>
        </div>

        {/* Search and Actions */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button 
            size="sm" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowNewFolder(!showNewFolder)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Folder
          </Button>
        </div>

        {/* New Folder Input */}
        {showNewFolder && (
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <Button size="sm" onClick={handleCreateFolder}>
              Create
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNewFolder(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No files match your search.' : 'This directory is empty.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    {getFileIcon(file)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          className="font-medium text-foreground hover:text-primary transition-colors truncate"
                          onClick={() => {
                            if (file.type === 'folder') {
                              onNavigate(`${currentPath}/${file.name}`.replace('//', '/'));
                            }
                          }}
                        >
                          {file.name}
                        </button>
                        {file.type === 'file' && (
                          <Badge variant="outline" className="text-xs">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.lastModified}</span>
                        <span>{file.permissions}</span>
                      </div>
                    </div>

                    {file.type === 'file' && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onEdit(file.name)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onDownload(file.name)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onDelete(file.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};