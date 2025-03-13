
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-destructive flex items-center justify-center">
              <span className="text-white font-bold">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Check the URL or try navigating back.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/workflows">
              <Search className="h-4 w-4" />
              Browse Workflows
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
