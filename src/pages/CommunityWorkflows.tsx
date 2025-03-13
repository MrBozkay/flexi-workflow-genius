import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Search, 
  Filter, 
  Users, 
  Star, 
  Heart, 
  Download,
  MessageSquare, 
  Share, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

const communityWorkflows = [
  {
    id: 1,
    title: 'Customer Support Chatbot',
    description: 'An AI workflow that handles customer inquiries with auto-responses.',
    author: 'Sarah Johnson',
    tags: ['Customer Service', 'AI', 'Automation'],
    likes: 156,
    downloads: 89,
    comments: 24,
    imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Customer+Support+Workflow',
  },
  {
    id: 2,
    title: 'Email Marketing Automation',
    description: 'Automate your email campaigns based on user behavior and engagement metrics.',
    author: 'Michael Chen',
    tags: ['Marketing', 'Email', 'Analytics'],
    likes: 248,
    downloads: 142,
    comments: 36,
    imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Email+Marketing+Workflow',
  },
  {
    id: 3,
    title: 'Data Enrichment Pipeline',
    description: 'Process and enrich data from multiple sources into a unified format.',
    author: 'Alex Morgan',
    tags: ['Data Processing', 'API', 'Integration'],
    likes: 103,
    downloads: 76,
    comments: 18,
    imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Data+Enrichment+Workflow',
  },
  {
    id: 4,
    title: 'Social Media Scheduler',
    description: 'Schedule and post content across multiple social platforms automatically.',
    author: 'Jamie Taylor',
    tags: ['Social Media', 'Content', 'Scheduling'],
    likes: 198,
    downloads: 112,
    comments: 29,
    imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Social+Media+Workflow',
  },
  {
    id: 5,
    title: 'Lead Qualification System',
    description: 'Automatically score and route leads based on behavior and demographics.',
    author: 'Chris Rodriguez',
    tags: ['Sales', 'CRM', 'Automation'],
    likes: 176,
    downloads: 98,
    comments: 22,
    imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Lead+Qualification+Workflow',
  },
  {
    id: 6,
    title: 'Document Processing Workflow',
    description: 'Extract, validate, and store information from documents using AI.',
    author: 'Pat Wilson',
    tags: ['Documents', 'OCR', 'AI'],
    likes: 132,
    downloads: 84,
    comments: 19,
    imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Document+Processing+Workflow',
  }
];

const CommunityWorkflows = () => {
  const [selectedTab, setSelectedTab] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Community Workflows</h1>
          </div>
          <Button onClick={() => navigate('/workflows/new')}>Create New Workflow</Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search workflows..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
              <span>Sort</span>
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

interface WorkflowProps {
  workflow: {
    id: number;
    title: string;
    description: string;
    author: string;
    tags: string[];
    likes: number;
    downloads: number;
    comments: number;
    imageUrl: string;
  };
}

const WorkflowCard = ({ workflow }: WorkflowProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="h-40 w-full overflow-hidden bg-muted">
        <img 
          src={workflow.imageUrl} 
          alt={workflow.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <Link to={`/community/${workflow.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold mb-2">{workflow.title}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{workflow.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {workflow.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Created by <span className="font-medium">{workflow.author}</span>
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isLiked ? workflow.likes + 1 : workflow.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{workflow.comments}</span>
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityWorkflows;
