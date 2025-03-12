
import React from 'react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { GitBranch, ArrowRight, Zap, Bot, Database, GitMerge } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-4 mb-12 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">FlexiFlow</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Create powerful AI-powered workflow automations with our intuitive drag-and-drop interface.
            Connect services, process data, and automate tasks with ease.
          </p>
          <div className="pt-2">
            <Button 
              size="lg" 
              onClick={() => navigate('/workflows/new')}
              className="group"
            >
              Get Started 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard 
            icon={<Zap className="w-5 h-5" />}
            title="Easy Automation"
            description="Build complex workflows without code using our visual drag-and-drop interface."
          />
          <FeatureCard 
            icon={<Bot className="w-5 h-5" />}
            title="AI Integration"
            description="Seamlessly integrate with OpenAI, Google AI, and other AI models."
          />
          <FeatureCard 
            icon={<Database className="w-5 h-5" />}
            title="API Connectivity"
            description="Connect to Google Sheets, Airtable, and other APIs with pre-built nodes."
          />
        </div>

        <div className="glass-panel p-6 animate-slideIn">
          <h2 className="text-xl font-semibold mb-4">Recent Workflows</h2>
          
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-4 border-b border-border hover:bg-accent/40 rounded-md cursor-pointer transition-colors"
              onClick={() => navigate(`/workflows/${i}`)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-md bg-primary/10">
                  <GitMerge className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Sample Workflow {i}</h3>
                  <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
          
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/workflows')}>
              View All Workflows
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="glass-panel p-6 space-y-3 animate-slideIn">
    <div className="p-2 rounded-md bg-primary/10 w-fit">
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 text-primary" })}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
