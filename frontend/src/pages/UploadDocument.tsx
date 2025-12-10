import DocumentUpload from '@/components/documents/DocumentUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle } from 'lucide-react';

const UploadDocument = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Upload Document</h1>
        <p className="text-gray-600">Upload your medical documents securely</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only PDF files are accepted. Maximum file size is 5MB.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle>Select PDF File</CardTitle>
          </div>
          <CardDescription>
            Choose a PDF file from your device to upload to your medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload />
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocument;