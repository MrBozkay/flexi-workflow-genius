
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Templates = () => {
  const templateCategories = [
    { id: 'all', name: 'All Templates' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'customer', name: 'Customer Service' },
    { id: 'automation', name: 'Automation' },
  ];

  const templates = [
    { 
      id: 1, 
      title: 'Email Marketing Campaign', 
      description: 'Automate your email marketing with this template',
      category: 'marketing',
      usageCount: 2451
    },
    { 
      id: 2, 
      title: 'Lead Generation', 
      description: 'Capture and qualify leads automatically',
      category: 'sales',
      usageCount: 1872
    },
    { 
      id: 3, 
      title: 'Customer Onboarding', 
      description: 'Streamline your customer onboarding process',
      category: 'customer',
      usageCount: 1340
    },
    { 
      id: 4, 
      title: 'Data Sync', 
      description: 'Keep your data in sync across multiple platforms',
      category: 'automation',
      usageCount: 987
    },
    { 
      id: 5, 
      title: 'Social Media Publishing', 
      description: 'Schedule and publish content across social platforms',
      category: 'marketing',
      usageCount: 1523
    },
    { 
      id: 6, 
      title: 'Support Ticket Routing', 
      description: 'Automatically route support tickets to the right team',
      category: 'customer',
      usageCount: 943
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Pre-built workflows to help you get started quickly
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Template</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            {templateCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templateCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates
                  .filter(t => category.id === 'all' || t.category === category.id)
                  .map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">{template.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="mr-2 h-4 w-4" />
                          Used by {template.usageCount.toLocaleString()} workflows
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Use Template</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Templates;
