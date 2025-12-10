import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { documentService } from '../../services/api';
import { ErrorCodes, ErrorMessages } from '@/types';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Only PDF files are allowed',
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'File size must be less than 5MB',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a PDF file to upload',
      });
      return;
    }

    setUploading(true);

    try {
      const response = await documentService.uploadDocument(selectedFile);

      if (response.success) {
        toast({
          title: 'Success!',
          description: `${selectedFile.name} uploaded successfully`,
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Navigate to documents page after 1 second
        setTimeout(() => navigate('/documents'), 1000);
      }
    } catch (error: any) {
      console.log("iha aaye hai");
      const errorCode = error.response?.data?.error as ErrorCodes;
      console.log(errorCode);
      const errorMessage =
        ErrorMessages[errorCode] || error.response?.data?.message || 'Upload failed';

      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drag and drop your PDF file here
            </p>
            <p className="text-sm text-gray-500 mt-1">or</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full"
        size="lg"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Upload Document
          </>
        )}
      </Button>

      {/* File Requirements */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>File format: PDF only</li>
            <li>Maximum file size: 5MB</li>
            <li>Files with duplicate names will be rejected</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentUpload;