import { useState } from 'react';
import { Document } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Trash2, Calendar, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onDownload: (id: number, filename: string) => void;
  onDelete: (id: number, filename: string) => void;
}

const DocumentCard = ({ document, onDownload, onDelete }: DocumentCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  const formatTime = (date: string) => {
    try {
      return format(new Date(date), 'hh:mm a');
    } catch {
      return '';
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden border-0 bg-white pt-0">
        {/* PDF Icon Section - Top Half */}
        <div className="w-full h-32 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-lg mb-2">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-medium text-red-700">PDF</p>
          </div>
        </div>

        {/* Info Section */}
        <CardContent className="p-4 space-y-3">
          {/* Filename */}
          <div>
            <p
              className="text-sm font-semibold text-gray-900 truncate"
              title={document.filename}
            >
              {document.filename}
            </p>
          </div>

          {/* File Size */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Size</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs">
              {formatFileSize(document.filesize)}
            </Badge>
          </div>

          {/* Upload Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Uploaded</span>
            </div>
            <span className="text-gray-900 font-medium">
              {formatDate(document.created_at)}
            </span>
          </div>

          {/* Upload Time */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Time</span>
            </div>
            <span className="text-gray-900 font-medium">
              {formatTime(document.created_at)}
            </span>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex gap-2 p-3 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs hover:bg-gray-50"
            onClick={() => onDownload(document.id, document.filename)}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{document.filename}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(document.id, document.filename);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentCard;