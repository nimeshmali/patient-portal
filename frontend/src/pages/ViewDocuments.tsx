import DocumentList from '@/components/documents/DocumentList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const ViewDocuments = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-600">View, download, and manage your medical documents</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle>Document Library</CardTitle>
          </div>
          <CardDescription>
            All your uploaded medical documents in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDocuments;