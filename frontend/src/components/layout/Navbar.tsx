import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Upload, List } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Patient<span className="text-blue-600">Portal</span>
            </span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/upload">
              <Button
                variant={location.pathname === '/upload' ? 'default' : 'outline'}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Add Document</span>
              </Button>
            </Link>
            <Link to="/documents">
              <Button
                variant={location.pathname === '/documents' ? 'default' : 'outline'}
                className="flex items-center space-x-2"
              >
                <List className="h-4 w-4" />
                <span>View All</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;