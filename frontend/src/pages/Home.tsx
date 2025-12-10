import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Shield,
  Zap,
  Database,
  Code,
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Easy Upload',
      description: 'Upload PDF medical documents with drag-and-drop or file selection',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Document Management',
      description: 'View, organize, and manage all your medical documents in one place',
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'Quick Download',
      description: 'Download your documents anytime, anywhere with a single click',
    },
    {
      icon: <Trash2 className="h-6 w-6" />,
      title: 'Secure Deletion',
      description: 'Remove documents when no longer needed with secure deletion',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'File Validation',
      description: 'PDF-only uploads with size limits and format validation',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast & Reliable',
      description: 'Optimized performance with efficient file handling and storage',
    },
  ];

  const techStack = {
    frontend: [
      'React 18',
      'TypeScript',
      'Vite',
      'TailwindCSS',
      'shadcn/ui',
      'React Router',
      'Axios',
    ],
    backend: [
      'Node.js',
      'Express',
      'TypeScript',
      'Drizzle ORM',
      'PostgreSQL',
      'Multer',
    ],
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-block">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            Healthcare Document Management
          </Badge>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">Patient Portal</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern, secure platform for managing your medical documents. Upload prescriptions,
          test results, and referral notes with ease.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Link to="/upload">
            <Button size="lg" className="text-lg px-8">
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>
          </Link>
          <Link to="/documents">
            <Button size="lg" variant="outline" className="text-lg px-8">
              <FileText className="mr-2 h-5 w-5" />
              View Documents
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Features</h2>
          <p className="text-gray-600">Everything you need to manage your medical documents</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Built With Modern Technology</h2>
          <p className="text-gray-600">Powered by cutting-edge tools and frameworks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Frontend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {techStack.frontend.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Backend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {techStack.backend.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Start managing your medical documents today. It's simple and secure.
        </p>
        <Link to="/upload">
          <Button size="lg" variant="secondary" className="text-lg px-8">
            <Upload className="mr-2 h-5 w-5" />
            Upload Your First Document
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;