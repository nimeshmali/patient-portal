import { useState, useEffect } from 'react';
import { documentService } from '../../services/api';
import { Document } from '@/types';
import { useToast } from '@/hooks/use-toast';
import DocumentCard from './DocumentCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileX } from 'lucide-react';

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await documentService.getAllDocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
      }
    } catch (err: any) {
      setError('Failed to load documents. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch documents',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = async (id: number, filename: string) => {
    try {
      await documentService.downloadDocument(id, filename);
      toast({
        title: 'Success',
        description: `${filename} downloaded successfully`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Failed to download document',
      });
    }
  };

  const handleDelete = async (id: number, filename: string) => {
    try {
      const response = await documentService.deleteDocument(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: `${filename} deleted successfully`,
        });
        // Refresh the list
        fetchDocuments();
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: err.response?.data?.message || 'Failed to delete document',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
          <FileX className="h-12 w-12 text-gray-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900">No Documents Yet</h3>
          <p className="text-gray-600 mt-2">Upload your first document to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Total Documents: <span className="font-semibold">{documents.length}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentList;