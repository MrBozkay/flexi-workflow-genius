import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Share, 
  Download, 
  ArrowLeft, 
  User,
  Calendar,
  Eye,
  GitBranch,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";

const workflowData = {
  id: 1,
  title: 'Customer Support Chatbot',
  description: 'An AI workflow that handles customer inquiries with automatic responses based on intent recognition. This workflow integrates with various APIs to provide real-time data and contextual responses.',
  longDescription: `
    This workflow uses the following components:
    
    1. **HTTP Webhook Trigger** - Listens for incoming chat messages
    2. **AI Intent Classifier** - Categorizes the user's query
    3. **Conditional Branching** - Routes to appropriate response flow
    4. **API Integration** - Fetches relevant data based on query
    5. **Template Response Generator** - Creates personalized responses
    6. **Output Handler** - Delivers response back to the user
    
    The workflow is designed to be extensible and can be customized for different industries and use cases.
  `,
  author: {
    name: 'Sarah Johnson',
    avatar: 'https://placehold.co/100/3b82f6/ffffff?text=SJ',
    role: 'Automation Specialist',
  },
  stats: {
    created: '2023-11-15',
    updated: '2024-05-02',
    views: 1892,
    likes: 156,
    downloads: 89,
    comments: 24,
  },
  tags: ['Customer Service', 'AI', 'Automation', 'Chatbot', 'Machine Learning'],
  imageUrl: 'https://placehold.co/1200x600/3b82f6/ffffff?text=Customer+Support+Workflow',
};

const comments = [
  {
    id: 1,
    author: {
      name: 'Michael Chen',
      avatar: 'https://placehold.co/100/10b981/ffffff?text=MC',
    },
    content: 'This is exactly what our team needed! We implemented it with some minor tweaks for our product support team and it reduced response times by 45%.',
    date: '2024-05-10',
    likes: 12,
  },
  {
    id: 2,
    author: {
      name: 'Priya Sharma',
      avatar: 'https://placehold.co/100/f59e0b/ffffff?text=PS',
    },
    content: 'Great workflow! I had an issue connecting it to our Slack instance though. Anyone else encounter this problem?',
    date: '2024-05-06',
    likes: 3,
  },
  {
    id: 3,
    author: {
      name: 'Alex Morgan',
      avatar: 'https://placehold.co/100/ec4899/ffffff?text=AM',
    },
    content: 'The documentation could be more detailed, especially around the API integration part. But overall this is a solid workflow that saved us a lot of development time.',
    date: '2024-05-01',
    likes: 7,
  },
];

const CommunityWorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLiked, setIsLiked] = useState(false);
  
  const handleForkWorkflow = () => {
    toast.success("Workflow forked successfully");
    navigate(`/workflows/${id}`);
  };
  
  const handleDownload = () => {
    toast.success("Workflow downloaded successfully");
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Button 
          variant="ghost" 
          className="mb-4 -ml-2 gap-2"
          onClick={() => navigate('/community')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Button>
        
        <div className="rounded-xl overflow-hidden mb-6 border bg-card shadow-sm">
          <div className="h-64 lg:h-80 w-full relative">
            <img 
              src={workflowData.imageUrl} 
              alt={workflowData.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{workflowData.title}</h1>
              <p className="max-w-2xl">{workflowData.description}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                    <TabsTrigger value="versions">Versions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{workflowData.longDescription}</p>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {workflowData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-6">
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-4 rounded-lg border bg-card/50">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                              <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">{comment.author.name}</h4>
                                <span className="text-sm text-muted-foreground">{comment.date}</span>
                              </div>
                              <p className="text-sm mb-2">{comment.content}</p>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-7 text-xs">
                                  <Heart className="h-3.5 w-3.5" />
                                  <span>{comment.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-7 text-xs">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="versions" className="mt-6">
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border bg-card/50 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Version 1.2.0</p>
                          <p className="text-sm text-muted-foreground">May 2, 2024 - Latest</p>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                      <div className="p-3 rounded-lg border bg-card/50 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Version 1.1.0</p>
                          <p className="text-sm text-muted-foreground">March 15, 2024</p>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      <div className="p-3 rounded-lg border bg-card/50 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Version 1.0.0</p>
                          <p className="text-sm text-muted-foreground">November 15, 2023</p>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:w-80">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={workflowData.author.avatar} alt={workflowData.author.name} />
                      <AvatarFallback>{workflowData.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{workflowData.author.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflowData.author.role}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="w-full mb-2"
                    onClick={handleForkWorkflow}
                  >
                    Fork Workflow
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full mb-4"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Created
                      </span>
                      <span>{workflowData.stats.created}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Updated
                      </span>
                      <span>{workflowData.stats.updated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Eye className="h-4 w-4" /> Views
                      </span>
                      <span>{workflowData.stats.views}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Download className="h-4 w-4" /> Downloads
                      </span>
                      <span>{workflowData.stats.downloads}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <GitBranch className="h-4 w-4" /> Forks
                      </span>
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityWorkflowDetail;
