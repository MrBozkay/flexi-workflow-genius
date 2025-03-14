
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/frontend/pages/Index";
import Workflows from "@/pages/Workflows";
import Templates from "@/pages/Templates";
import Executions from "@/pages/Executions";
import AIModels from "@/pages/AIModels";
import APIConnections from "@/pages/APIConnections";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/NotFound";
import CommunityWorkflows from "@/pages/CommunityWorkflows";
import CommunityWorkflowDetail from "@/pages/CommunityWorkflowDetail";
import Settings from "@/pages/Settings";
import Auth from "@/frontend/pages/Auth";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-primary/30"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-foreground">Loading FlexiFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
      <Route path="/workflows/:id" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
      <Route path="/workflows/new" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityWorkflows /></ProtectedRoute>} />
      <Route path="/community/:id" element={<ProtectedRoute><CommunityWorkflowDetail /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/executions" element={<ProtectedRoute><Executions /></ProtectedRoute>} />
      <Route path="/integrations/ai" element={<ProtectedRoute><AIModels /></ProtectedRoute>} />
      <Route path="/integrations/apis" element={<ProtectedRoute><APIConnections /></ProtectedRoute>} />
      <Route path="/integrations/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
